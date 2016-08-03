let _brainfuck_vm_global = this;
let _brainfuck_vm_document = this["document"];

module Brainfuck {
	export module VmCompiler {
		export enum VmOpType {
			AddDataPtr,
			AddData,
			SetData,
			SystemCall,
			JumpIf,
			JumpIfNot,
		}
		export function vmOpTypeToString(type: VmOpType): string { return VmOpType[type]; }

		export interface VmOp {
			type:			VmOpType;
			dataOffset:		number;
			value:			number;
		}
		export function vmOpToString(op: VmOp): string {
			return !op ? "??" : vmOpTypeToString(op.type) +
				(op.value ? (" ("+op.value+")") : "") +
				(op.dataOffset ? ("@ "+op.dataOffset) : "");
		}
		export interface Program {
			ops:	VmOp[];
			locs:	Debugger.SourceLocation[];
		}
		export interface State {
			code:		Program;
			data:		number[];
			codePtr:	number;
			dataPtr:	number;
			sysCalls:	((vm)=>void)[];

			insRan:			number;
			runTime:		number;
			wallStart:		number,
		}


		export function compile(program: Program, ast: AST.Node[]) {
			for (let astI=0; astI<ast.length; ++astI) {
				var node = ast[astI];

				let push = (op: VmOp) => {
					program.ops.push(op);
					program.locs.push(node.location);
				};

				switch (node.type) {
					case AST.NodeType.AddDataPtr:	push({type: VmOpType.AddDataPtr,	value: node.value || 0,			dataOffset: 0}); break;
					case AST.NodeType.AddData:		push({type: VmOpType.AddData,		value: node.value || 0,			dataOffset: node.dataOffset || 0 }); break;
					case AST.NodeType.SetData:		push({type: VmOpType.SetData,		value: node.value || 0,			dataOffset: node.dataOffset || 0 }); break;
					case AST.NodeType.SystemCall:	push({type: VmOpType.SystemCall,	value: node.systemCall || 0,	dataOffset: 0}); break;
					case AST.NodeType.BreakIf:
						let afterSystemCall = program.ops.length+2;
						push({type: VmOpType.JumpIfNot,		value: afterSystemCall,			dataOffset: 0});
						push({type: VmOpType.SystemCall,	value: AST.SystemCall.Break,	dataOffset: 0});
						break;
					case AST.NodeType.Loop:
						let firstJump = {type: VmOpType.JumpIfNot, value: undefined, dataOffset: 0};
						push(firstJump);
						let afterFirstJump = program.ops.length;

						compile(program, node.childScope);

						let lastJump = {type: VmOpType.JumpIf, value: afterFirstJump, dataOffset: 0};
						push(lastJump);
						let afterLastJump = program.ops.length;

						firstJump.value = afterLastJump;
						break;
					default:
						console.error("Invalid node.type :=",node.type);
						break;
				}
			}
		}

		function badSysCall(vm: State) {
			console.error("Unexpected VmOpType", VmOpType[vm.code[vm.codePtr].type]);
			vm.sysCalls[AST.SystemCall.TapeEnd](vm);
		}

		function runOne(vm: State) {
			let op = vm.code.ops[vm.codePtr];
			if (!op) { vm.sysCalls[AST.SystemCall.TapeEnd](vm); return; }
			let dp = vm.dataPtr + (op.dataOffset || 0);
			switch (op.type) {
				case VmOpType.AddDataPtr:	vm.dataPtr += op.value;										++vm.codePtr; break;
				case VmOpType.AddData:		vm.data[dp] = (op.value + 256 + (vm.data[dp] || 0)) % 256;	++vm.codePtr; break;
				case VmOpType.SetData:		vm.data[dp] = (op.value + 256) % 256;						++vm.codePtr; break;
				case VmOpType.JumpIf:		if ( vm.data[dp]) vm.codePtr = op.value; else				++vm.codePtr; break;
				case VmOpType.JumpIfNot:	if (!vm.data[dp]) vm.codePtr = op.value; else				++vm.codePtr; break;
				case VmOpType.SystemCall:	(vm.sysCalls[op.value] || badSysCall)(vm);					++vm.codePtr; break;
				default:					badSysCall(vm);												break;
			}
		}

		function runSome(vm: State, maxInstructions: number) {
			let tStart = Date.now();
			for (var instructionsRan=0; instructionsRan<maxInstructions; ++instructionsRan) runOne(vm);
			let tStop = Date.now();
			vm.insRan += instructionsRan;
			vm.runTime += (tStop-tStart) / 1000;
		}

		function lpad(s: string, padding: string) { return padding.substr(0,padding.length-s.length) + s; }
		function addr(n: number): string { return lpad(n.toString(16), "0x0000"); }
		function sourceLocToString(sl: Debugger.SourceLocation) { return !sl ? "unknown" : (sl.file + "(" + lpad(sl.line.toString(), "   ") + ")"); }

		function createSymbolLookup(program: Program): Debugger.SymbolLookup {
			return {
				addrToSourceLocation: (address: number) => program.locs[address],
				sourceLocationToAddr: (sourceLocation: Debugger.SourceLocation) => {
					for (let i=0; i<program.locs.length; ++i) {
						if (Debugger.sourceLocationEqualColumn(sourceLocation,program.locs[i])) {
							return i;
						}
					}
				},
			};
		}

		function getRegistersList(vm: State, src: string): Debugger.RegistersList {
			return  [
				["Core Registers:",""],
				["     code",	addr(vm.codePtr)																	],
				["    *code",	vmOpToString(vm.code.ops[vm.codePtr])												],
				["    @code",	sourceLocToString(vm.code.locs[vm.codePtr])											],
				["     data",	addr(vm.dataPtr)																	],
				["    *data",	(vm.data[vm.dataPtr] || "0").toString()												],
				["------------------------------",""],
				["Performance",""],
				["    ran  ",	vm.insRan.toLocaleString()															],
				[" VM ran/s",	((vm.insRan / vm.runTime) | 0).toLocaleString()										],
				[" VM     s",	(vm.runTime|0).toString()															],
				[" Wa.ran/s",	((vm.insRan / (Date.now()-vm.wallStart) * 1000) | 0).toLocaleString()				],
				[" Wall   s",	((Date.now()-vm.wallStart)/1000|0).toString()										],
				["------------------------------",""],
				["Code size:",""],
				["Brainfuck",	src.length.toString()			],
				[" Bytecode",	vm.code.ops.length.toString()	],
			];
		}

		function getThreads(vm: State, src: string): Debugger.Thread[] {
			return [{
				registers: () => getRegistersList(vm, src),
				currentPos: () => vm.codePtr,
			}];
		}

		export function createDebugger(code: string, stdout: (b: string) => void): Debugger {
			let errors = false;
			let parseResult = AST.parse({ code: code, onError: (e) => { if (e.severity == AST.ErrorSeverity.Error) errors = true; }});
			if (errors) return undefined;

			let program : Program = { ops: [], locs: [] };
			compile(program, parseResult.optimizedAst);

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
			let runHandle : number = undefined;

			let doPause			= () => { if (runHandle !== undefined) clearInterval(runHandle); runHandle = undefined; };
			let doContinue		= () => { if (runHandle === undefined) runHandle = setInterval(() => runSome(vm, 100000), 0); }; // Increase instruction limit after fixing loop perf?
			let doStop			= () => { doPause(); vm.dataPtr = vm.data.length; };
			let doStep			= () => runOne(vm);
			let getMemory		= () => vm.data;
			let getState		= () =>
				vm === undefined ?						Debugger.State.Detatched
				: vm.codePtr >= vm.code.locs.length ?	Debugger.State.Done
				: runHandle !== undefined ?				Debugger.State.Running
				:										Debugger.State.Paused;

			vm.sysCalls[AST.SystemCall.Putch] = vm => stdout(String.fromCharCode(vm.data[vm.dataPtr]));
			vm.sysCalls[AST.SystemCall.TapeEnd] = vm => doStop();

			return {
				symbols:	createSymbolLookup(program),
				state:		getState,
				threads:	() => getThreads(vm, code),
				memory:		getMemory,

				pause:		doPause,
				continue:	doContinue,
				stop:		doStop,
				step:		doStep,
			};
		}

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

			let program : Program = { ops: [], locs: [] };
			compile(program, parseResult.optimizedAst);

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
				memory:		() => vm.data,

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
				vm.sysCalls[AST.SystemCall.TapeEnd]	= vm => { reply({desc: "system-call-tape-end"}); updateVm(); _brainfuck_vm_global.stop(); };
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
