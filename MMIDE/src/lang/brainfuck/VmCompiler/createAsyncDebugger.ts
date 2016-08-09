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

			let vm : State = {
				code:		program,
				data:		[],
				codePtr:	0,
				dataPtr:	0,
				sysCalls:	[],

				insRan:		0,
				runTime:	0,
				wallStart:	Date.now(),
			};

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

			return {
				symbols:	createSymbolLookup(program),
				state:		() => state,
				threads:	() => getThreads(vm, code),
				memory:		(start, size) => vm.data.slice(start, start+size),

				pause:		() => worker.postMessage({desc: "pause"}),
				continue:	() => worker.postMessage({desc: "continue"}),
				stop:		() => worker.postMessage({desc: "stop"}),
				step:		() => worker.postMessage({desc: "step"}),
			};
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

				vm.sysCalls[AST.SystemCall.Putch]	= vm => { reply({desc: "system-call-stdout", value: String.fromCharCode(vm.data[vm.dataPtr]) }); };
				vm.sysCalls[AST.SystemCall.TapeEnd]	= vm => { reply({desc: "system-call-tape-end"}); updateVm(); if (runHandle !== undefined) clearInterval(runHandle); runHandle = undefined; };
			}

			function onMessage(ev: MessageEvent) {
				switch (ev.data.desc) {
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
