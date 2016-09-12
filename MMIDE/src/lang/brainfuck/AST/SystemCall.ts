module Brainfuck {
	export module AST {
		export enum SystemCall {
			Break,
			Putch,
			Getch,
			TapeEnd,
		}
	}
}
