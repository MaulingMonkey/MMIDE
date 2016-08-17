let _brainfuck_vm_global = this;
let _brainfuck_vm_document = this["document"];

module Brainfuck {
	export module VmCompiler {
		const isWorker = !_brainfuck_vm_document;
		const isMainTab = !isWorker;
		const supportsWorker = _brainfuck_vm_global["Worker"];

		export function createAsyncDebugger(code: string, stdout: (b: string) => void): Debugger {
			console.assert(isMainTab);
			if (!isMainTab) return undefined;
			if (!supportsWorker) return createDebugger(code, stdout);

			let errors = false;
			let parseResult = AST.parse({ code: code, onError: (e) => { if (e.severity == AST.ErrorSeverity.Error) errors = true; }});
			if (errors) return undefined;

			let program = compileProgram(parseResult.optimizedAst);

			let vm = createInitState(program);

			let state = Debugger.State.Paused;

			let worker = new Worker("mmide.js");
			worker.addEventListener("message", reply => {
				switch (reply.data.desc) {
					case "update-state":
						state = reply.data.value;
						break;
					case "update-vm-data":
						let src = <State>reply.data.value;
						vm.data		= src.data;
						vm.codePtr	= src.codePtr;
						vm.dataPtr	= src.dataPtr;
						vm.insRan	= src.insRan;
						vm.runTime	= src.runTime;
						break;
					case "system-call-stdout":
						stdout(reply.data.value);
						break;
					case "system-call-tape-end":
						state = Debugger.State.Done;
						break;
					default:
						console.error("Unexpected worker message desc:",reply.data.desc);
						break;
				}
			});
			worker.postMessage({desc: "brainfuck-debugger-init", state: vm});

			let debug : Debugger = {
				symbols:		createSymbolLookup(program),
				breakpoints:	{ setBreakpoints: (breakpoints) => worker.postMessage({desc: "breakpoints.set", data: breakpoints}) },

				state:			() => state,
				threads:		() => getThreads(vm, code),
				memory:			(start, size) => vm.data.slice(start, start+size),

				pause:			() => worker.postMessage({desc: "pause"}),
				continue:		() => worker.postMessage({desc: "continue"}),
				stop:			() => worker.postMessage({desc: "stop"}),
				step:			() => worker.postMessage({desc: "step"}),
			};

			return debug;
		}

		if (isWorker) {
			let vm : State = undefined;
			let runHandle : number = undefined;

			const reply : (data) => void = _brainfuck_vm_global["postMessage"];

			function updateVm() {
				reply({desc: "update-vm-data", value: { data: vm.data, codePtr: vm.codePtr, dataPtr: vm.dataPtr, insRan: vm.insRan, runTime: vm.runTime }});
			}

			function tick() {
				//runSome(vm, 100000); // ? - ~10ms - ~24M/s instructions executed
				runSome(vm, 300000);   // 5 - ~30ms? - ~68M/s instructions executed - significantly diminishing returns beyond this point
				//runSome(vm, 500000); // ? - ~50ms? - ~68M/s instructions executed - still seems perfectly responsive FWIW
				updateVm();
			}

			function onInitMessage(ev: MessageEvent) {
				removeEventListener("message", onInitMessage);
				if (ev.data.desc != "brainfuck-debugger-init") return;
				addEventListener("message", onMessage);
				vm = ev.data.state;

				vm.sysCalls[AST.SystemCall.Break]	= (vm: State) => {
					let isInjectedBreak = vm.program.ops[vm.codePtr] !== vm.loadedCode[vm.codePtr];

					// Pause the VM
					if (runHandle !== undefined) clearInterval(runHandle);
					runHandle = undefined;
					reply({desc: "update-state", value: Debugger.State.Paused});

					--vm.codePtr; // Prevent advancing of codePtr after handling this sysCall
				};
				vm.sysCalls[AST.SystemCall.Putch]	= vm => { reply({desc: "system-call-stdout", value: String.fromCharCode(vm.data[vm.dataPtr]) }); };
				vm.sysCalls[AST.SystemCall.TapeEnd]	= vm => { reply({desc: "system-call-tape-end"}); updateVm(); if (runHandle !== undefined) clearInterval(runHandle); runHandle = undefined; };
			}

			function onMessage(ev: MessageEvent) {
				switch (ev.data.desc) {
					case "breakpoints.set":
						if (!vm) return;
						let breakpoints : Debugger.Breakpoint[] = ev.data.data;
						let breakLocs = breakpoints.filter(bp => bp.enabled).map(bp => Debugger.parseSourceLocation(bp.location)).filter(loc => !!loc);

						vm.loadedCode = vm.program.ops.map((op,i)=>{
							let loc = vm.program.locs[i];
							let shouldBreak = breakLocs.some(bl => {
								if (bl.file   && bl.file   !== loc.file  ) return false;
								if (bl.line   && bl.line   !== loc.line  ) return false;
								if (bl.column && bl.column !== loc.column) return false;
								return true;
							});

							let replacementOp : VmOp = !shouldBreak ? op : { type: VmOpType.SystemCall, value: AST.SystemCall.Break, dataOffset: 0 };
							return replacementOp;
						});
						break;
					case "pause":
						if (runHandle !== undefined) clearInterval(runHandle);
						runHandle = undefined;
						reply({desc: "update-state", value: Debugger.State.Paused});
						break;
					case "continue":
						if (runHandle === undefined) runHandle = setInterval(tick, 0);
						reply({desc: "update-state", value: Debugger.State.Running});
						break;
					case "stop":
						if (runHandle !== undefined) clearInterval(runHandle);
						runHandle = undefined;
						reply({desc: "update-state", value: Debugger.State.Done});
						break;
					case "step":
						runOne(vm);
						updateVm();
						// no update-state
						break;
				}
			}

			addEventListener("message", onInitMessage);
		}
	}
}
