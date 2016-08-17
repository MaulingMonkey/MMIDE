module Brainfuck {
	export module VmCompiler {
		function lpad(s: string, padding: string) { return padding.substr(0,padding.length-s.length) + s; }
		function addr(n: number): string { return lpad(n.toString(16), "0x0000"); }
		function sourceLocationToString(sl: Debugger.SourceLocation) { return !sl ? "unknown" : (sl.file + "(" + lpad(sl.line.toString(), "   ") + ")"); }

		export function getRegistersList(vm: State, src: string): Debugger.RegistersList {
			return  [
				["Registers:",""],
				["     code",	addr(vm.codePtr)														],
				["    *code",	vmOpToString(vm.program.ops[vm.codePtr])								],
				["    @code",	sourceLocationToString(vm.program.locs[vm.codePtr])						],
				["     data",	addr(vm.dataPtr)														],
				["    *data",	(vm.data[vm.dataPtr] || "0").toString()									],
				["------------------------------",""],
				["Performance:",""],
				["    ran  ",	vm.insRan.toLocaleString()												],
				[" VM ran/s",	((vm.insRan / vm.runTime) | 0).toLocaleString()							],
				[" VM     s",	(vm.runTime|0).toString()												],
				[" Wa.ran/s",	((vm.insRan / (Date.now()-vm.wallStart) * 1000) | 0).toLocaleString()	],
				[" Wall   s",	((Date.now()-vm.wallStart)/1000|0).toString()							],
				["------------------------------",""],
				["Code size:",""],
				["Brainfuck",	src.length.toString()				],
				[" Bytecode",	vm.program.ops.length.toString()	],
			];
		}
	}
}
