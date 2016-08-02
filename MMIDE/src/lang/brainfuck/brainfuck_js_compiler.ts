module Brainfuck {
	export module JsCompiler {
		function toJsNumber(n: number) {
			let s = n.toString();
			if (!/^(([0-9]+)|([0-9]+)\.([0-9]+))$/.exec(s)) return "0";
			return s;
		}
		console.assert(toJsNumber(<number><any>"") == "0");
		console.assert(toJsNumber(<number><any>"0") == "0");
		console.assert(toJsNumber(<number><any>"123") == "123");
		console.assert(toJsNumber(<number><any>"a") == "0");
		console.assert(toJsNumber(<number><any>".") == "0");

		function toJsLocString(l: Debugger.SourceLocation) {
			let s = l.file + "(" + l.line + ")";
			if (!/^[0-9a-zA-Z_.]+$/.exec(s)) return "\"unavailable\"";
			return "\"" + s + "\"";
		}
		//console.assert(toJsLocString({ file: "a", line: 1, column: 1 }) == "\"a(1)\"");
		//console.assert(toJsLocString({ file: "0", line: 1, column: 1 }) == "\"0(1)\"");
		console.assert(toJsLocString({ file: "!", line: 1, column: 1 }) == "\"unavailable\"");

		interface CompileArgs {
			debug:			boolean;
			systemCalls:	string[];
		}

		function compileTo(js: string[], ast: AST.Node[], args: CompileArgs): boolean {
			for (let astI=0; astI<ast.length; ++astI) {
				let op = ast[astI];

				if (args.debug) {
					js.push("location = "+toJsLocString(op.location)+";");
				}

				switch (op.type) {
					case AST.NodeType.AddDataPtr:	js.push("dataPtr += "+op.value+";"); break;
					case AST.NodeType.AddData:		js.push("data[dataPtr + ("+op.dataOffset+")] += ("+op.value+" + 256) % 256;"); break;
					case AST.NodeType.SetData:		js.push("data[dataPtr + ("+op.dataOffset+")]  = ("+op.value+" + 256) % 256;"); break;
					case AST.NodeType.SystemCall:	js.push(args.systemCalls[op.systemCall]); break;
					case AST.NodeType.BreakIf:
						js.push("if (data[dataPtr]) {");
						js.push(args.systemCalls[AST.SystemCall.Break]);
						js.push("}");
						break;
					case AST.NodeType.Loop:
						js.push("while (data[dataPtr]) {");
						compileTo(js, op.childScope, args);
						js.push("}");
						break;
					default:						return false;
				}
			}
			return true;
		}

		export function compile(ast: AST.Node[], args: CompileArgs) {
			let js : string[] = [];
			js.push("(function () {");
			js.push("\"use strict\";");
			if (args.debug) js.push("var location = \"unavailable\";");
			js.push("var data = [];");
			js.push("var dataPtr = 0;");
			compileTo(js, ast, args);
			js.push("})();");
		}
	}
}
