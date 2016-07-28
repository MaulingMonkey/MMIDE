module UI {
	export module Debug {
		let theDebugger : Debugger = undefined;

		export function Start(paused: boolean) {
			UI.Output.outputs().forEach(o => o.clear());

			let editor = document.getElementsByClassName("editor");
			console.assert(editor.length == 1);
			theDebugger = Brainfuck.createDebugger(editor.item(0).textContent, (stdout) => {
				UI.Output.outputs().forEach(o => o.write(stdout));
			});
			if (!paused) theDebugger.continue();
			setDebugState(theDebugger.state());
		}

		export function Stop() {
			theDebugger.stop();
			theDebugger = undefined;
			setDebugState(DebugState.Detatched);
		}

		export function Continue() {
			theDebugger.continue();
			setDebugState(theDebugger.state());
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

		var prevState : DebugState = undefined;
		function setDebugState(state: DebugState) {
			if (prevState == state) return;
			let styles = "debug-state-detatched debug-state-done debug-state-running debug-state-paused".split(' ');

			let visibleStyle = "";
			switch (state) {
			case DebugState.Detatched:	visibleStyle = "debug-state-detatched";	break;
			case DebugState.Done:		visibleStyle = "debug-state-done";		break;
			case DebugState.Running:	visibleStyle = "debug-state-running";	break;
			case DebugState.Paused:		visibleStyle = "debug-state-paused";	break;
			}

			console.log("state :=",visibleStyle);
			//console.assert(styles.indexOf(visibleStyle) !== -1);
			styles.forEach(style => { if (style !== visibleStyle) toggleClassVisibility(style, false); });
			toggleClassVisibility(visibleStyle, true);
			prevState = state;
		}

		addEventListener("load", (e) => {
			if (prevState === undefined) setDebugState(DebugState.Detatched);
			setInterval(function() {
				setDebugState(theDebugger === undefined ? DebugState.Detatched : theDebugger.state());
				UI.Registers.update(theDebugger === undefined ? [] : theDebugger.threads()[0].registers());
				UI.Memory.update(theDebugger);
			}, 1/60);
		});
	}
}
