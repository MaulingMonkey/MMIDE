module Brainfuck {
	export module VmCompiler {
		export interface State {
			program:		Program;
			loadedCode:		VmOp[]; // Copy of program.ops which is actually run - may include breakpoints etc.

			data:			number[];
			codePtr:		number;
			dataPtr:		number;
			sysCalls:		((vm)=>boolean)[];

			insRan:			number;
			runTime:		number;
			wallStart:		number,
		}

		export function createInitState(program: Program): State {
			let s : State = {
				program:	program,
				loadedCode:	program.ops.map(op=>op),

				data:		[],
				codePtr:	0,
				dataPtr:	0,
				sysCalls:	[],

				insRan:		0,
				runTime:	0,
				wallStart:	Date.now()
			};
			return s;
		}
	}
}
