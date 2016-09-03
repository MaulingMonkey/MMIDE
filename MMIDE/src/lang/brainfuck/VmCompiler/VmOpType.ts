module Brainfuck {
	export module VmCompiler {
		export enum VmOpType {
			AddDataPtr,
			AddData,
			AddMulData,
			SetData,
			SystemCall,
			JumpIf,
			JumpIfNot,
		}
	}
}
