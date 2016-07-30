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
			dataOffset?:	number;
			value?:			number;
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
		}


		export function compile(program: Program, ast: AST.Node[]) {
			for (let astI=0; astI<ast.length; ++astI) {
				let node = ast[astI];

				program.locs.push(node.location);
				switch (node.type) {
					case AST.NodeType.AddDataPtr:	program.ops.push({type: VmOpType.AddDataPtr,	value: node.value || 0}); break;
					case AST.NodeType.AddData:		program.ops.push({type: VmOpType.AddData,		value: node.value || 0, dataOffset: node.dataOffset || 0 }); break;
					case AST.NodeType.SetData:		program.ops.push({type: VmOpType.SetData,		value: node.value || 0, dataOffset: node.dataOffset || 0 }); break;
					case AST.NodeType.SystemCall:	program.ops.push({type: VmOpType.SystemCall,	value: node.systemCall || 0}); break;
					case AST.NodeType.BreakIf:
						let afterSystemCall = program.ops.length+2;
						program.ops.push({type: VmOpType.JumpIfNot,		value: afterSystemCall});
						program.ops.push({type: VmOpType.SystemCall,	value: AST.SystemCall.Break});
						break;
					case AST.NodeType.Loop:
						let firstJump = {type: VmOpType.JumpIfNot, value: undefined};
						program.ops.push(firstJump);
						let afterFirstJump = program.ops.length;

						compile(program, node.childScope);
						let lastJump = {type: VmOpType.JumpIf, value: afterFirstJump};
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

		function runSome(vm: State, maxInstructions: number, stdout: (b: string) => void, stop: () => void) {
			let stdoutBuf = "";
			for (var instructionsRan=0; instructionsRan<maxInstructions; ++instructionsRan) {
				let op = vm.code.ops[vm.codePtr];
				if (!op) { stop(); break; }
				let dp = vm.dataPtr + (op.dataOffset || 0);
				switch (op.type) {
					case VmOpType.AddDataPtr:	vm.dataPtr += op.value;										++vm.codePtr; break;
					case VmOpType.AddData:		vm.data[dp] = (op.value + 256 + (vm.data[dp] || 0)) % 256;	++vm.codePtr; break;
					case VmOpType.SetData:		vm.data[dp] = (op.value + 256) % 256;						++vm.codePtr; break;
					case VmOpType.JumpIf:		if ( vm.data[dp]) vm.codePtr = op.value; else				++vm.codePtr; break;
					case VmOpType.JumpIfNot:	if (!vm.data[dp]) vm.codePtr = op.value; else				++vm.codePtr; break;
					case VmOpType.SystemCall:
						switch (op.value) {
							//case AST.SystemCall.Break:	... break;
							//case AST.SystemCall.Getch:	... break;
							case AST.SystemCall.Putch:		stdoutBuf += String.fromCharCode(vm.data[dp]); break;
							//case AST.SystemCall.Putch:		stdoutBuf += vm.data[dp].toString()+" "; break;
							case AST.SystemCall.TapeEnd:	stop(); break;
							default:
								stop();
								console.error("Unexpected SystemCall", op.value, op);
								break;
						}
						++vm.codePtr;
						break;
					default:
						stop();
						console.error("Unexpected VmOpType", op.type, op);
						break;
				}
			}
			if (stdoutBuf != "") stdout(stdoutBuf);
			//console.log("Ran",instructionsRan,"instructions (IP=", vm.codePtr, "(", vm.code[vm.codePtr],") DP=", vm.dataPtr, "(", vm.data[vm.dataPtr] ,"))");
		}

		function sourceLocToString(sl: AST.SourceLocation) { return !sl ? "unknown" : (sl.file + "(" + sl.line + ")"); }

		export function createDebugger(code: string, stdout: (b: string) => void): Debugger {
			let errors = false;
			let parseResult = AST.parse({ code: code, onError: (e) => { if (e.severity == AST.ErrorSeverity.Error) errors = true; }});
			if (errors) return undefined;

			let program : Program = { ops: [], locs: [] };
			compile(program, parseResult.optimizedAst);

			let vm : State = { code: program, data: [], codePtr: 0, dataPtr: 0 };
			let runHandle : number = undefined;

			let doPause			= () => { if (runHandle !== undefined) clearInterval(runHandle); runHandle = undefined; };
			let doContinue		= () => { if (runHandle === undefined) runHandle = setInterval(() => runSome(vm, 100000, stdout, doPause), 0); }; // Increase instruction limit after fixing loop perf?
			let doStop			= () => { doPause(); vm.dataPtr = vm.data.length; }
			let getRegisters : ()=>RegistersList = () => [
				[" code",	vm.codePtr.toString()																],
				["*code",	vmOpToString(vm.code.ops[vm.codePtr])												],
				["@code",	sourceLocToString(vm.code.locs[vm.codePtr])											],
				[" data",	vm.dataPtr.toString()																],
				["*data",	(vm.data[vm.dataPtr] || "??").toString()											],
			];
			let getThreads		= () => [{registers: getRegisters}];
			let getMemory		= () => vm.data;
			let getState		= () =>
				vm === undefined ?						DebugState.Detatched
				: vm.codePtr >= vm.code.locs.length ?	DebugState.Done
				: runHandle !== undefined ?				DebugState.Running
				:										DebugState.Paused;

			return {
				state:		getState,
				threads:	getThreads,
				memory:		getMemory,

				pause:		doPause,
				continue:	doContinue,
				stop:		doStop,
			};
		}
	}
}
