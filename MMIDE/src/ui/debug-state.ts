module UI {
	export module Debug {
		export var prevState : Debugger.State = undefined;
		export function setDebugState(state: Debugger.State) {
			if (prevState == state) return;
			ITC.sendTo<DebugStateChanged>("mmide-debug-state", { newState: state });
			prevState = state;
		}

		interface DebugStateChanged extends ITC.AgingHeader { newState: Debugger.State; }

		function toggleClassVisibility(class_: string, visible: boolean) {
			byClassName(class_).forEach(e => e.style.display = visible ? "" : "none");
		}

		addEventListener("load", loadEvent => {
			ITC.listenTo<DebugStateChanged>("mmide-debug-state", dsc => {
				let styles = "debug-state-detatched debug-state-done debug-state-running debug-state-paused".split(' ');

				let visibleStyle = "";
				switch (dsc.newState) {
				case Debugger.State.Detatched:	visibleStyle = "debug-state-detatched";	break;
				case Debugger.State.Done:		visibleStyle = "debug-state-done";		break;
				case Debugger.State.Running:	visibleStyle = "debug-state-running";	break;
				case Debugger.State.Paused:		visibleStyle = "debug-state-paused";	break;
				}

				//console.log("state :=",visibleStyle);
				//console.assert(styles.indexOf(visibleStyle) !== -1);
				styles.forEach(style => { if (style !== visibleStyle) toggleClassVisibility(style, false); });
				toggleClassVisibility(visibleStyle, true);
			});
		});
	}
}
