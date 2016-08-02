module UI {
	export module Debug {
		let theDebugger : Debugger = undefined;

		export function Start(paused: boolean) {
			UI.Output.stdio().clear();

			let script = UI.Editor.getScript();
			//theDebugger = Brainfuck.Eval.createDebugger(script, (stdout) => {
			theDebugger = Brainfuck.VmCompiler.createDebugger(script, (stdout) => {
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

		function toggleClassVisibility(class_: string, visible: boolean) {
			let es = document.getElementsByClassName(class_);
			//console.log(class_, "(", es.length, ") :=", visible);
			for (let i=0; i<es.length; ++i) {
				let e = <HTMLElement> es.item(i);
				e.style.display = visible ? "" : "none";
			}
		}

		var prevState : Debugger.State = undefined;
		function setDebugState(state: Debugger.State) {
			if (prevState == state) return;
			let styles = "debug-state-detatched debug-state-done debug-state-running debug-state-paused".split(' ');

			let visibleStyle = "";
			switch (state) {
			case Debugger.State.Detatched:	visibleStyle = "debug-state-detatched";	break;
			case Debugger.State.Done:		visibleStyle = "debug-state-done";		break;
			case Debugger.State.Running:	visibleStyle = "debug-state-running";	break;
			case Debugger.State.Paused:		visibleStyle = "debug-state-paused";	break;
			}

			console.log("state :=",visibleStyle);
			//console.assert(styles.indexOf(visibleStyle) !== -1);
			styles.forEach(style => { if (style !== visibleStyle) toggleClassVisibility(style, false); });
			toggleClassVisibility(visibleStyle, true);
			prevState = state;
		}

		addEventListener("load", (e) => {
			if (prevState === undefined) setDebugState(Debugger.State.Detatched);
			setInterval(function() {
				let thread		= theDebugger === undefined ? undefined : theDebugger.threads()[0];
				let address		= thread === undefined ? undefined : thread.currentPos();
				let sourceLoc	= theDebugger === undefined ? undefined : theDebugger.symbols.addrToSourceLocation(address);

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
