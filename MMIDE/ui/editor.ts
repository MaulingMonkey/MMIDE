module UI {
	export module Editor {
		var _editor : ace.Editor = undefined;

		function editor() {
			if (_editor === undefined) {
				_editor = ace.edit("editor");
				_editor.setTheme("ace/theme/monokai");

				let session = _editor.getSession();
				//session.setMode("ace/mode/javascript");
				session.setTabSize(4);
				session.setUseSoftTabs(false);
			}
			return _editor;
		}

		export function getScript(): string {
			//let editor = document.getElementsByClassName("editor");
			//console.assert(editor.length == 1);
			//return editor.item(0).textContent;

			return editor().getValue();
		}

		export function setScript(script: string) {
			//let eds = document.getElementsByClassName("editor");
			//console.assert(eds.length === 1);
			//let ed = <HTMLElement> eds.item(0);
			//ed.textContent = script;

			editor().setValue(script);
		}

		export function setTheme(theme: string) {
			editor().setTheme("ace/theme/"+theme.toLowerCase().replace(' ','_'));
		}

		addEventListener("load", function(e) {
			editor();

			// "Ace only resizes itself on window events. If you resize the editor div in another manner, and need Ace to resize, use the following"
			// Currently, console output, memory dump resizes, etc. may alter the editor div size.
			// Takes maybe ~5ms/check from an initial look at Chrome timeline results?  Not nearly my biggest perf issue atm.
			setInterval(function(){ editor().resize(false); }, 10);
		});
	}
}
