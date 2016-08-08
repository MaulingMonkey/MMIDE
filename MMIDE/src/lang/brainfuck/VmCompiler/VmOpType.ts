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
	}
}
