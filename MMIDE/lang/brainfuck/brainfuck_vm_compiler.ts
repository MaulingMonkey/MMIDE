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
			locs:	AST.SourceLocation[];
		}
		export interface State {
			code:		Program;
			data:		number[];
			codePtr:	number;
			dataPtr:	number;
			sysCalls:	((vm)=>void)[];

			insRan:			number;
			runTime:		number;
		}


		export function compile(program: Program, ast: AST.Node[]) {
			for (let astI=0; astI<ast.length; ++astI) {
				let node = ast[astI];

				program.locs.push(node.location);
				switch (node.type) {
					case AST.NodeType.AddDataPtr:	program.ops.push({type: VmOpType.AddDataPtr,	value: node.value || 0,		dataOffset: 0}); break;
					case AST.NodeType.AddData:		program.ops.push({type: VmOpType.AddData,		value: node.value || 0,		dataOffset: node.dataOffset || 0 }); break;
					case AST.NodeType.SetData:		program.ops.push({type: VmOpType.SetData,		value: node.value || 0,		dataOffset: node.dataOffset || 0 }); break;
					case AST.NodeType.SystemCall:	program.ops.push({type: VmOpType.SystemCall,	value: node.systemCall || 0,dataOffset: 0}); break;
					case AST.NodeType.BreakIf:
						let afterSystemCall = program.ops.length+2;
						program.ops.push({type: VmOpType.JumpIfNot,		value: afterSystemCall,			dataOffset: 0});
						program.ops.push({type: VmOpType.SystemCall,	value: AST.SystemCall.Break,	dataOffset: 0});
						break;
					case AST.NodeType.Loop:
						let firstJump = {type: VmOpType.JumpIfNot, value: undefined, dataOffset: 0};
						program.ops.push(firstJump);
						let afterFirstJump = program.ops.length;

						compile(program, node.childScope);
						let lastJump = {type: VmOpType.JumpIf, value: afterFirstJump, dataOffset: 0};
						program.ops.push(lastJump);
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
			//console.log("Ran",instructionsRan,"instructions (IP=", vm.codePtr, "(", vm.code[vm.codePtr],") DP=", vm.dataPtr, "(", vm.data[vm.dataPtr] ,"))");
			let tStop = Date.now();
			vm.insRan += instructionsRan;
			vm.runTime += (tStop-tStart) / 1000;
		}

		function lpad(s: string, padding: string) { return padding.substr(0,padding.length-s.length) + s; }
		function addr(n: number): string { return lpad(n.toString(16), "0x0000"); }
		function sourceLocToString(sl: AST.SourceLocation) { return !sl ? "unknown" : (sl.file + "(" + lpad(sl.line.toString(), "   ") + ")"); }

		export function createDebugger(code: string, stdout: (b: string) => void): Debugger {
			let errors = false;
			let parseResult = AST.parse({ code: code, onError: (e) => { if (e.severity == AST.ErrorSeverity.Error) errors = true; }});
			if (errors) return undefined;

			let program : Program = { ops: [], locs: [] };
			compile(program, parseResult.optimizedAst);

			let vm : State = {
				code: program,
				data: [],
				codePtr: 0,
				dataPtr: 0,
				insRan: 0,
				runTime: 0,
				sysCalls: [],
			};
			let runHandle : number = undefined;

			let doPause			= () => { if (runHandle !== undefined) clearInterval(runHandle); runHandle = undefined; };
			let doContinue		= () => { if (runHandle === undefined) runHandle = setInterval(() => runSome(vm, 100000), 0); }; // Increase instruction limit after fixing loop perf?
			let doStop			= () => { doPause(); vm.dataPtr = vm.data.length; };
			let doStep			= () => { runOne(vm); };
			let getRegisters : ()=>RegistersList = () => [
				[" code",	addr(vm.codePtr)																	],
				["*code",	vmOpToString(vm.code.ops[vm.codePtr])												],
				["@code",	sourceLocToString(vm.code.locs[vm.codePtr])											],
				[" data",	addr(vm.dataPtr)																	],
				["*data",	(vm.data[vm.dataPtr] || "0").toString()												],
				["     ",""],
				["ran  ",	vm.insRan.toLocaleString()															],
				["ran/s",	((vm.insRan / vm.runTime) | 0).toLocaleString()										],
				["    s",	(vm.runTime|0).toString()															],
				["     ",""],
				["code length (original)", code.length.toString()			],
				["code length (bytecode)", program.ops.length.toString()	],
			];
			let getCurrentPos : () => AST.SourceLocation = () => program.locs[vm.codePtr];
			let getThreads : () => DebuggerThread[] = () => [{
				registers: getRegisters,
				currentPos: getCurrentPos,
			}];
			let getMemory		= () => vm.data;
			let getState		= () =>
				vm === undefined ?						DebugState.Detatched
				: vm.codePtr >= vm.code.locs.length ?	DebugState.Done
				: runHandle !== undefined ?				DebugState.Running
				:										DebugState.Paused;

			vm.sysCalls[AST.SystemCall.Putch] = vm => stdout(String.fromCharCode(vm.data[vm.dataPtr]));
			vm.sysCalls[AST.SystemCall.TapeEnd] = vm => doStop();

			return {
				state:		getState,
				threads:	getThreads,
				memory:		getMemory,

				pause:		doPause,
				continue:	doContinue,
				stop:		doStop,
				step:	doStep,
			};
		}
	}
}
