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
			return editor().getValue();
		}

		export function setScript(script: string) {
			editor().setValue(script);
		}

		export function setTheme(theme: string) {
			editor().setTheme("ace/theme/"+theme.toLowerCase().replace(' ','_'));
		}

		function toggleGutterDecoration(s: ace.EditSession, row: number, className: string, enable: boolean) {
			if (enable) {
				s.removeGutterDecoration(row, className);
				s.addGutterDecoration(row, className);
			} else {
				s.removeGutterDecoration(row, className);
			}
		}

		export function setErrors(errors: Brainfuck.AST.Error[]) {
			let s = editor().getSession();
			let lineErrors : Brainfuck.AST.Error[][] = [];
			errors.forEach(error => {
				if (!error.location || !error.location.line) return;
				let le = lineErrors[error.location.line]
				if (le === undefined) le = lineErrors[error.location.line] = [];
				le.push(error);
			});
			console.log(lineErrors);

			s.clearBreakpoints();
			for (let lineIndex = 0; lineIndex < s.getLength(); ++lineIndex) {
				let worst : Brainfuck.AST.ErrorSeverity = Math.max(...(lineErrors[lineIndex+1] || []).map(e => e.severity));

				toggleGutterDecoration(s, lineIndex, "ace_info"		, worst == Brainfuck.AST.ErrorSeverity.Info);
				toggleGutterDecoration(s, lineIndex, "ace_warning"	, worst == Brainfuck.AST.ErrorSeverity.Warning);
				toggleGutterDecoration(s, lineIndex, "ace_error"	, worst == Brainfuck.AST.ErrorSeverity.Error);
			}
		}

		addEventListener("load", function(e) {
			editor();

			// "Ace only resizes itself on window events. If you resize the editor div in another manner, and need Ace to resize, use the following"
			// Currently, console output, memory dump resizes, etc. may alter the editor div size.
			// Takes maybe ~5ms/check from an initial look at Chrome timeline results?  Not nearly my biggest perf issue atm.
			setInterval(function(){ editor().resize(false); }, 10);

			setInterval(function(){
				var errors = [];
				Brainfuck.AST.parse({
					code:		getScript(),
					onError:	e => errors.push(e),
				});
				setErrors(errors);
			}, 100);
		});
	}
}
