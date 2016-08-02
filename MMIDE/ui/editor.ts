module UI {
	export module Editor {
		var _editor : ace.Editor = undefined;

		function editor() {
			if (_editor === undefined) {
				if (!document.getElementById("editor") || !window["ace"]) {
					_editor = null;
					return;
				}
				_editor = ace.edit("editor");
				_editor.setTheme("ace/theme/monokai");

				let session = _editor.getSession();
				//session.setMode("ace/mode/javascript");
				session.setTabSize(4);
				session.setUseSoftTabs(false);
			}
			return _editor;
		}

		export function isAvailable(): boolean {
			return !!editor();
		}

		export function getScript(): string {
			let e = editor();
			return e ? e.getValue() : "";
		}

		export function setScript(script: string) {
			let e = editor();
			if (e) e.setValue(script);
		}

		export function setTheme(theme: string) {
			let e = editor();
			if (e) e.setTheme("ace/theme/"+theme.toLowerCase().replace(' ','_'));
		}

		function errorToAnnotation(error: Brainfuck.AST.Error): ace.Annotation {
			let errorType = "error";
			switch (error.severity) {
			case Brainfuck.AST.ErrorSeverity.Verbose:	errorType = "info";		break;
			case Brainfuck.AST.ErrorSeverity.Info:		errorType = "info";		break;
			case Brainfuck.AST.ErrorSeverity.Warning:	errorType = "warning";	break;
			case Brainfuck.AST.ErrorSeverity.Error:		errorType = "error";	break;
			}

			let a : ace.Annotation = {
				row:	error.location.line-1,
				column:	error.location.column-1,
				text:	error.description,
				type:	errorType,
			};

			return a;
		}

		export function setErrors(errors: Brainfuck.AST.Error[]) {
			let e = editor();
			if (!e) return;
			let s = e.getSession();
			let lineErrors : Brainfuck.AST.Error[][] = [];
			errors.forEach(error => {
				if (!error.location || !error.location.line) return;
				let le = lineErrors[error.location.line]
				if (le === undefined) le = lineErrors[error.location.line] = [];
				le.push(error);
			});

			s.setAnnotations(errors.map(errorToAnnotation).filter(a => !!a));
		}

		let currentMarker : number = undefined;
		let currentLine = -1;
		let currentCol = -1;
		//let Range = ace.require("ace/Range").Range;
		export function setCurrentPosition(line: number, col: number = -1) {
			let e = editor();
			if (!e) return;
			let s = e.getSession();

			if (currentLine != line) {
				s.removeGutterDecoration(currentLine, "current-line");
				currentLine = line-1;
				s.addGutterDecoration(currentLine, "current-line");
			}

			if (currentCol != col) {
				currentCol = col;
				if (currentMarker !== undefined) s.removeMarker(currentMarker);
				if (col != -1) {
					//let range = <ace.Range>new (<any>Range)(line-1, col-1, line-1, col-0);
					//let range = new ace.Range(line-1, col-1, line-1, col-0);
					let range = s.getAWordRange(line-1, col-1);
					range.start.column = col-1;
					range.end.column = col-0;
					currentMarker = s.addMarker(range, "current-column", "text", false);
				} else {
					currentMarker = undefined;
				}
			}
		}

		addEventListener("load", function(ev) {
			let ed = editor();
			if (!ed) return;

			// "Ace only resizes itself on window events. If you resize the editor div in another manner, and need Ace to resize, use the following"
			// Currently, console output, memory dump resizes, etc. may alter the editor div size.
			// Takes maybe ~5ms/check from an initial look at Chrome timeline results?  Not nearly my biggest perf issue atm.
			setInterval(function(){ ed.resize(false); }, 100);

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
