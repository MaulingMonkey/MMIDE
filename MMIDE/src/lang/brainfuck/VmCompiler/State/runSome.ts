module Brainfuck {
	export module VmCompiler {
		function badSysCall(vm: State) {
			console.error("Unexpected VmOpType", VmOpType[vm.program[vm.codePtr].type]);
			vm.sysCalls[AST.SystemCall.TapeEnd](vm);
			return false;
		}

		function modCeil(n: number, d: number): number { return ((n%d)+d)%d; }
		function modCeilSmall(n: number, d: number): number { return (n+d)%d; }

		export function runOne(vm: State) {
			let op = vm.loadedCode[vm.codePtr];
			if (!op) { vm.sysCalls[AST.SystemCall.TapeEnd](vm); return; }
			let dst = vm.dataPtr + (op.dataOffset || 0);
			let src = vm.dataPtr; // no op.dataOffset equivalent for srcs just yet

			switch (op.type) {
				case VmOpType.AddDataPtr:	vm.dataPtr += op.value;															++vm.codePtr; return true;
				case VmOpType.AddData:		vm.data[dst] = modCeilSmall(op.value + (vm.data[dst]||0), 256);					++vm.codePtr; return true;
				case VmOpType.AddMulData:	vm.data[dst] = modCeil((vm.data[dst]||0) + op.value * (vm.data[src]||0), 256);	++vm.codePtr; return true;
				case VmOpType.SetData:		vm.data[dst] = modCeilSmall(op.value,256);										++vm.codePtr; return true;
				case VmOpType.JumpIf:		if ( vm.data[dst]) vm.codePtr = op.value; else									++vm.codePtr; return true;
				case VmOpType.JumpIfNot:	if (!vm.data[dst]) vm.codePtr = op.value; else									++vm.codePtr; return true;
				case VmOpType.SystemCall:	return (vm.sysCalls[op.value] || badSysCall)(vm);								// NOTE: System call is responsible for codePtr manipulation!
				default:					return badSysCall(vm);															// NOTE: System call is responsible for codePtr manipulation!
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
