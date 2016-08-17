module Brainfuck {
	export module VmCompiler {
		export function createDebugger(code: string, stdout: (b: string) => void): Debugger {
			let errors = false;
			let parseResult = AST.parse({ code: code, onError: (e) => { if (e.severity == AST.ErrorSeverity.Error) errors = true; }});
			if (errors) return undefined;

			let program = compileProgram(parseResult.optimizedAst);

			let vm : State = createInitState(program);
			let runHandle : number = undefined;

			let doPause			= () => { if (runHandle !== undefined) clearInterval(runHandle); runHandle = undefined; };
			let doContinue		= () => { if (runHandle === undefined) runHandle = setInterval(() => runSome(vm, 100000), 0); }; // Increase instruction limit after fixing loop perf?
			let doStop			= () => { doPause(); vm.dataPtr = vm.data.length; };
			let doStep			= () => runOne(vm);
			let getMemory		= (start: number, size: number) => vm.data.slice(start, start+size);
			let getState		= () =>
				vm === undefined ?						Debugger.State.Detatched
				: vm.codePtr >= vm.program.locs.length ?	Debugger.State.Done
				: runHandle !== undefined ?				Debugger.State.Running
				:										Debugger.State.Paused;

			vm.sysCalls[AST.SystemCall.Putch] = vm => { stdout(String.fromCharCode(vm.data[vm.dataPtr])); ++vm.codePtr; return true; };
			vm.sysCalls[AST.SystemCall.TapeEnd] = vm => { doStop(); return false; };

			return {
				symbols:	createSymbolLookup(program),
				breakpoints:null,

				state:		getState,
				threads:	() => getThreads(vm, code),
				memory:		getMemory,

				pause:		doPause,
				continue:	doContinue,
				stop:		doStop,
				step:		doStep,
			};
		}
	}
}
