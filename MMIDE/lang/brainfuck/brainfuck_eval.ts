module Brainfuck {
	export module Eval {
		interface State {
			code:		string;
			data:		number[];
			codePtr:	number;
			dataPtr:	number;
		}

		function createVm(code: string): State {
			return {
				code:		code,
				data:		[],
				codePtr:	0,
				dataPtr:	0,
			};
		}

		function loopStart(vm: State) {
			if (!!vm.data[vm.dataPtr]) {
				++vm.codePtr;
			} else {
				/* scan forward */
				let nested = 0;
				for (;;) {
					switch (vm.code[vm.codePtr++]) {
						case "[":		++nested; break;
						case "]":		if (--nested === 0) return; break;
						case undefined:	return;
					}
				}
			}
		}

		function loopEnd(vm: State) {
			if (!vm.data[vm.dataPtr]) {
				++vm.codePtr;
			} else {
				/* scan back */
				let nested = 0;
				for (;;) {
					switch (vm.code[vm.codePtr--]) {
						case "]":		++nested; break;
						case "[":		if (--nested === 0) { vm.codePtr += 1; return; } break;
						case undefined:	vm.codePtr = vm.code.length; break;
					}
				}
			}
		}

		function runSome(vm: State, maxInstructions: number, stdout: (b: string) => void, stop: () => void) {
			let stdoutBuf = "";
			for (var instructionsRan=0; instructionsRan<maxInstructions; ++instructionsRan) {
				switch (vm.code[vm.codePtr]) {
					case "<":		--vm.dataPtr;												++vm.codePtr; break;
					case ">":		++vm.dataPtr;												++vm.codePtr; break;
					case "+":		vm.data[vm.dataPtr] = ((vm.data[vm.dataPtr] || 0)+  1)%256;	++vm.codePtr; break;
					case "-":		vm.data[vm.dataPtr] = ((vm.data[vm.dataPtr] || 0)+255)%256;	++vm.codePtr; break;
					//case ".":		stdout((vm.data[vm.dataPtr] || 0).toString()+" ");		++vm.codePtr; break;
					case ".":		stdout(String.fromCharCode(vm.data[vm.dataPtr] || 0));		++vm.codePtr; break;
					case ",":		vm.data[vm.dataPtr] = 0; /* Input not yet supported */		++vm.codePtr; break;
					case "[":		loopStart(vm);	break;
					case "]":		loopEnd(vm);	break;
					case undefined:	stop();			break;
					default:		++vm.codePtr;	break;
				}
			}
			//console.log("Ran",instructionsRan,"instructions (IP=", vm.codePtr, "(", vm.code[vm.codePtr],") DP=", vm.dataPtr, "(", vm.data[vm.dataPtr] ,"))");
		}

		export function createDebugger(code: string, stdout: (b: string) => void): Debugger {
			let vm = createVm(code);
			let runHandle : number = undefined;

			let doPause			= () => { if (runHandle !== undefined) clearInterval(runHandle); runHandle = undefined; };
			let doContinue		= () => { if (runHandle === undefined) runHandle = setInterval(() => runSome(vm, 100000, stdout, doPause), 0); }; // Increase instruction limit after fixing loop perf?
			let doStop			= () => { doPause(); vm.dataPtr = vm.data.length; }
			let getRegisters : ()=>RegistersList = () => [
				[" code",	"0x"+vm.codePtr.toString(16)														],
				["*code",	(vm.code[vm.codePtr] || "??").replace("\n","\\n").replace("\r","\\r").toString()	],
				[" data",	"0x"+vm.dataPtr.toString(16)														],
				["*data",	(vm.data[vm.dataPtr] || "??").toString()											],
			];
			let getThreads		= () => [{registers: getRegisters}];
			let getMemory		= () => vm.data;
			let getState		= () =>
				vm === undefined ?					DebugState.Detatched
				: vm.codePtr >= vm.code.length ?	DebugState.Done
				: runHandle !== undefined ?			DebugState.Running
				:									DebugState.Paused;

			return {
				state:		getState,
				threads:	getThreads,
				memory:		getMemory,

				pause:		doPause,
				continue:	doContinue,
				stop:		doStop,
			};
		}
	}
}
