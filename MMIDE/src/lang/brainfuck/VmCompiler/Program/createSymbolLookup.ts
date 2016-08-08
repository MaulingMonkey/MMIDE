module Brainfuck {
	export module VmCompiler {
		export function createSymbolLookup(program: Program): Debugger.SymbolLookup {
			return {
				addrToSourceLocation: (address: number) => program.locs[address],
				sourceLocationToAddr: (sourceLocation: Debugger.SourceLocation) => {
					for (let i=0; i<program.locs.length; ++i) {
						if (Debugger.sourceLocationEqualColumn(sourceLocation,program.locs[i])) {
							return i;
						}
					}
				},
			};
		}
	}
}
