module Brainfuck {
	export module AST {
		export enum ErrorSeverity {
			Verbose,
			Info,
			Warning,
			Error,
		}

		export interface Error {
			severity:		ErrorSeverity;
			description:	string;
			location?:		Debugger.SourceLocation;
		}
	}
}
