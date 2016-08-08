module Brainfuck {
	export module VmCompiler {
		export interface VmOp {
			type:			VmOpType;
			dataOffset:		number;
			value:			number;
		}
		export function vmOpToString(op: VmOp): string {
			return !op ? "??" : VmOpType[op.type] +
				(op.value ? (" ("+op.value+")") : "") +
				(op.dataOffset ? ("@ "+op.dataOffset) : "");
		}
	}
}
