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
		export function vmOpToPsuedoCode(op: VmOp): string {
			switch (op.type) {
			case VmOpType.AddDataPtr:	return "data += "+op.value;
			case VmOpType.AddData:		return "data["+op.dataOffset+"] += "+op.value;
			case VmOpType.AddMulData:	return "data["+op.dataOffset+"] += data[0] * "+op.value;
			case VmOpType.SetData:		return "data["+op.dataOffset+"] <- "+op.value;
			case VmOpType.JumpIf:		return "if data["+op.dataOffset+"] != 0 jump 0x"+("0000"+op.value.toString(16)).substr(-4);
			case VmOpType.JumpIfNot:	return "if data["+op.dataOffset+"] == 0 jump 0x"+("0000"+op.value.toString(16)).substr(-4);
			case VmOpType.SystemCall:	return "syscall "+op.value;
			}
		}
	}
}
