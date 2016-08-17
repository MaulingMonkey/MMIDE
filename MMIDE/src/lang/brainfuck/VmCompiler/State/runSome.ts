module Brainfuck {
	export module VmCompiler {
		function badSysCall(vm: State) {
			console.error("Unexpected VmOpType", VmOpType[vm.program[vm.codePtr].type]);
			vm.sysCalls[AST.SystemCall.TapeEnd](vm);
			return false;
		}

		export function runOne(vm: State) {
			let op = vm.loadedCode[vm.codePtr];
			if (!op) { vm.sysCalls[AST.SystemCall.TapeEnd](vm); return; }
			let dp = vm.dataPtr + (op.dataOffset || 0);
			switch (op.type) {
				case VmOpType.AddDataPtr:	vm.dataPtr += op.value;										++vm.codePtr; return true;
				case VmOpType.AddData:		vm.data[dp] = (op.value + 256 + (vm.data[dp] || 0)) % 256;	++vm.codePtr; return true;
				case VmOpType.SetData:		vm.data[dp] = (op.value + 256) % 256;						++vm.codePtr; return true;
				case VmOpType.JumpIf:		if ( vm.data[dp]) vm.codePtr = op.value; else				++vm.codePtr; return true;
				case VmOpType.JumpIfNot:	if (!vm.data[dp]) vm.codePtr = op.value; else				++vm.codePtr; return true;
				case VmOpType.SystemCall:	return (vm.sysCalls[op.value] || badSysCall)(vm);			// NOTE: System call is responsible for codePtr manipulation!
				default:					return badSysCall(vm);										// NOTE: System call is responsible for codePtr manipulation!
			}
		}

		export function runSome(vm: State, maxInstructions: number) {
			let tStart = Date.now();
			for (var instructionsRan=0; instructionsRan<maxInstructions; ++instructionsRan) if (!runOne(vm)) break;
			let tStop = Date.now();
			vm.insRan += instructionsRan;
			vm.runTime += (tStop-tStart) / 1000;
		}
	}
}
