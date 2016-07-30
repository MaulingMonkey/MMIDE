module Brainfuck {
	export module AST {
		export enum NodeType {
			AddDataPtr,	// e.g. <>
			AddData,	// e.g. +-
			SystemCall,	// e.g. .,
			Loop,		// e.g. []
		}

		export enum SystemCall {
			Putch,
			Getch,
			TapeEnd,
		}

		export interface SourceLocation {
			file:	string;
			line:	number;
			column:	number;
			byte:	number;
		}
		function cloneSourceLocation(sl: SourceLocation): SourceLocation { return { file: sl.file, line: sl.line, column: sl.column, byte: sl.byte }; }

		export interface Node {
			type:			NodeType;
			value?:			number;
			systemCall?:	SystemCall;
			childScope?:	Node[];
			location:		SourceLocation;
		}

		export enum ErrorSeverity {
			Verbose,
			Info,
			Warning,
			Error,
		}

		export interface Error {
			severity:		ErrorSeverity;
			description:	string;
			location?:		SourceLocation;
		}

		export interface ParseArgs {
			code:		string;
			onError:	(error: Error) => void;
		}

		function defaultOnError(error: Error) {
			if (!!error.location) {
				console.error("Error:",error.description,"@",error.location.file + "(" + error.location.line + ")");
			} else {
				console.error("Error:",error.description,"@",error.location.file + "(" + error.location.line + ")");
			}
		}

		export function parse(args: ParseArgs): Node[] {
			try {
				// Preconditions
				console.assert(!!args,					"parse: args is not optional");
				console.assert(args.code !== undefined,	"parse: args.code is not optional");
				console.assert(args.code !== null,		"parse: args.code is not optional");

				// Context
				var location : SourceLocation = { file: "memory.bf", line: 1, column: 1, byte: 0 };
				let code = args.code;
				let _onError = args.onError || defaultOnError; // Prefer softError/fatalError
				let _root : Node[] = []; // You probably want scope
				let _scopeStack = [_root]; // Prefer scope/pushScope/popScope
				let atLocation = (tempLocation: SourceLocation, action: ()=>void) => { let origLocation = location; location = tempLocation; action(); location = origLocation; };

				// Utils
				let info		= (desc: string) => _onError({ severity: ErrorSeverity.Info,	description: desc, location: cloneSourceLocation(location) });
				let warning		= (desc: string) => _onError({ severity: ErrorSeverity.Warning,	description: desc, location: cloneSourceLocation(location) });
				let error		= (desc: string) => _onError({ severity: ErrorSeverity.Error,	description: desc, location: cloneSourceLocation(location) });
				let scope		= () => _scopeStack[_scopeStack.length-1];
				let pushScope	= () => { let scope = []; _scopeStack.push(scope); return scope; }
				let popScope	= () => { if (_scopeStack.length == 1) error("Reached end of scope ']', but was already at the root scope!"); else _scopeStack.pop(); };

				for (let codeI = 0; codeI < code.length; ++codeI) {
					let ch = code[codeI];
					switch (ch) {
					case "<":		scope().push({ type: NodeType.AddDataPtr,	value: -1,						location: cloneSourceLocation(location) }); break;
					case ">":		scope().push({ type: NodeType.AddDataPtr,	value: +1,						location: cloneSourceLocation(location) }); break;
					case "+":		scope().push({ type: NodeType.AddData,		value: +1,						location: cloneSourceLocation(location) }); break;
					case "-":		scope().push({ type: NodeType.AddData,		value: -1,						location: cloneSourceLocation(location) }); break;
					case ".":		scope().push({ type: NodeType.SystemCall,	systemCall: SystemCall.Getch,	location: cloneSourceLocation(location) }); break;
					case ",":		scope().push({ type: NodeType.SystemCall,	systemCall: SystemCall.Putch,	location: cloneSourceLocation(location) }); break;
					case "[":		scope().push({ type: NodeType.Loop,			childScope: pushScope(),		location: cloneSourceLocation(location) }); break;
					case "]":		popScope(); break;
					default:		/* noop */ break;
					}

					++location.byte;
					if (ch == "\n") {
						++location.line;
						location.column = 1;
					} else {
						++location.column;
					}
				}

				scope().push({ type: NodeType.SystemCall, systemCall: SystemCall.TapeEnd, location: cloneSourceLocation(location) });
				if (_scopeStack.length > 1) {
					for (let i=_scopeStack.length-2; i>=0; --i) {
						let badScopeNode = _scopeStack[i][_scopeStack[i].length-1];
						atLocation(badScopeNode.location, () => error("Start of scope '[' not terminated before end of file!"));
					}

					error("Unexpected end of file!");
					return [];
				}
				return _root;
			} catch(e) {
				return [];
			}
		}
	}
}
