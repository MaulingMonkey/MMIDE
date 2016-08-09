module UI {
	export module Debug {
		let theDebugger : Debugger = undefined;

		export function Start(paused: boolean) {
			UI.Output.stdio().clear();

			let script = UI.Editor.getScript();
			//theDebugger = Brainfuck.Eval.createDebugger(script, (stdout) => {
			//theDebugger = Brainfuck.VmCompiler.createDebugger(script, (stdout) => {
			theDebugger = Brainfuck.VmCompiler.createAsyncDebugger(script, (stdout) => {
				UI.Output.stdio().write(stdout);
			});
			if (!paused) theDebugger.continue();
			setDebugState(theDebugger.state());
		}

		export function Stop() {
			theDebugger.stop();
			theDebugger = undefined;
			setDebugState(Debugger.State.Detatched);
		}

		export function Continue() {
			theDebugger.continue();
			setDebugState(theDebugger.state());
		}

		export function Step() {
			theDebugger.step();
		}

		export function Pause() {
			theDebugger.pause();
			setDebugState(theDebugger.state());
		}

		export function Restart(paused: boolean) {
			if (theDebugger !== undefined) Stop();
			Start(paused);
		}

		addEventListener("load", (e) => {
			if (!UI.Editor.isAvailable()) return; // We're not the "Main" tab, don't drive debug state
			if (prevState === undefined) setDebugState(Debugger.State.Detatched);
			setInterval(function() {
				let thread		= theDebugger === undefined ? undefined : theDebugger.threads()[0];
				let address		= thread === undefined ? undefined : thread.currentPos();
				let sourceLoc	= theDebugger === undefined || theDebugger.symbols === undefined ? undefined : theDebugger.symbols.addrToSourceLocation(address);

				setDebugState(theDebugger === undefined ? Debugger.State.Detatched : theDebugger.state());
				UI.Registers.update(theDebugger);
				UI.Memory.update(theDebugger);
				UI.Editor.setCurrentPosition(
					sourceLoc === undefined ? -1 : sourceLoc.line,
					sourceLoc === undefined ? -1 : sourceLoc.column);
			}, 10);
		});
	}
}
