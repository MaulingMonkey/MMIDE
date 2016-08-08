module Brainfuck {
	export module VmCompiler {
		export function getThreads(vm: State, src: string): Debugger.Thread[] {
			return [{
				registers: () => getRegistersList(vm, src),
				currentPos: () => vm.codePtr,
			}];
		}
	}
}
