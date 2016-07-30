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
			let s = editor().getSession();
			let lineErrors : Brainfuck.AST.Error[][] = [];
			errors.forEach(error => {
				if (!error.location || !error.location.line) return;
				let le = lineErrors[error.location.line]
				if (le === undefined) le = lineErrors[error.location.line] = [];
				le.push(error);
			});

			s.setAnnotations(errors.map(errorToAnnotation).filter(a => !!a));
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
