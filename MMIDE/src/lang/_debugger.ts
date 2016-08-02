module Debugger {
	export enum State {
		Detatched,
		Paused,
		Running,
		Done,
	}

	export type Register = [/* name */ string, /* value */ string];
	export type RegistersList = Register[];
	export interface Thread {
		registers():	RegistersList;
		currentPos():	number;
	}

	export interface SymbolLookup {
		addrToSourceLocation(address: number): SourceLocation;
		sourceLocationToAddr(sourceLocation: SourceLocation): number;
	}

	export interface Debugger {
		symbols:		SymbolLookup;

		state():		State;
		threads():		Thread[];
		memory():		number[];

		stop();					// Running, Paused	-> None
		continue();				// Paused			-> Running
		pause();				// Running			-> Paused
		step();
	}

	export interface SourceLocation {
		file:		string;
		line:		number;
		column:		number;
	}
	export function cloneSourceLocation(sl: SourceLocation): SourceLocation { return { file: sl.file, line: sl.line, column: sl.column }; }
	export function sourceLocationEqualColumn	(a: SourceLocation, b: SourceLocation) { return a.file === b.file && a.line === b.line && a.column === b.column; }
	export function sourceLocationEqualLine		(a: SourceLocation, b: SourceLocation) { return a.file === b.file && a.line === b.line; }
	export function sourceLocationEqualFile		(a: SourceLocation, b: SourceLocation) { return a.file === b.file; }
}

type Debugger = Debugger.Debugger;
