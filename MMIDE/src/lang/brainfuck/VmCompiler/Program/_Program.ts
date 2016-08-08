module Brainfuck {
	export module VmCompiler {
		export interface Program {
			ops:	VmOp[];
			locs:	Debugger.SourceLocation[];
		}
	}
}
