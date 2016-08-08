module Brainfuck {
	export module VmCompiler {
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
	}
}
