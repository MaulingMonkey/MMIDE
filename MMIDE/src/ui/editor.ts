module UI {
	export module Editor {
		var _editor : ace.Editor = undefined;

		function editor() {
			if (_editor === undefined) {
				if (!byId("editor") || !window["ace"]) {
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

		let oldMarker : number = undefined;
		let oldLineIndex = -1;
		let oldColIndex  = -1;
		//let Range = ace.require("ace/Range").Range;
		export function setCurrentPosition(lineNo: number, colNo: number = 0) {
			let newLineIndex = lineNo-1;
			let newColIndex = colNo-1;

			let lineIndexChanged = oldLineIndex !== newLineIndex;
			let colIndexChanged  = oldColIndex  !== newColIndex  || lineIndexChanged;

			let e = editor();
			if (!e) return;
			let s = e.getSession();

			if (lineIndexChanged) {
				s.removeGutterDecoration(oldLineIndex, "current-line");
				s.addGutterDecoration(newLineIndex, "current-line");
			}

			if (colIndexChanged) {
				if (oldMarker !== undefined) s.removeMarker(oldMarker);
				if (newColIndex != -1) {
					//let range = <ace.Range>new (<any>Range)(line-1, col-1, line-1, col-0);
					//let range = new ace.Range(line-1, col-1, line-1, col-0);
					let range = s.getAWordRange(newLineIndex, newColIndex);
					range.start.column = newColIndex+0;
					range.end.column = newColIndex+1;
					oldMarker = s.addMarker(range, "current-column", "text", false);
				} else {
					oldMarker = undefined;
				}
			}

			oldLineIndex = newLineIndex;
			oldColIndex = newColIndex;
		}

		export interface LineBreakpoint {
			line:		number;
			enabled:	boolean;
		}
		export function setLineBreakpoints(breakpoints: LineBreakpoint[]) {
			let e = editor();
			if (!e) return;
			let session = e.getSession();
			session.clearBreakpoints();
			breakpoints.forEach(bp => session.setBreakpoint(bp.line-1, bp.enabled ? "breakpoint-enabled-line" : "breakpoint-disabled-line"));
			//console.log("Set breakpoints:",breakpoints[0],breakpoints[1]);
		}

		addEventListener("lateLoaded", function(ev) {
			let ed = editor();
			if (!ed) return;

			// "Ace only resizes itself on window events. If you resize the editor div in another manner, and need Ace to resize, use the following"
			// Currently, console output, memory dump resizes, etc. may alter the editor div size.
			// Takes maybe ~5ms/check from an initial look at Chrome timeline results?  Not nearly my biggest perf issue atm.
			setInterval(function(){ ed.resize(false); }, 100);

			var errors = [];
			var lastScript = "";
			setInterval(function(){
				let newScript = getScript();
				if (newScript == lastScript) return;

				lastScript = newScript;
				errors = [];
				Brainfuck.AST.parse({
					code:		newScript,
					onError:	e => errors.push(e),
				});
				setErrors(errors);
			}, 100);
		});
	}
}
