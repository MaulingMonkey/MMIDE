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

	export interface Breakpoint {
		enabled:		boolean;
		location:		string;
		condition:		string;
		onHit:			string;
	}
	export interface BreakpointsConfig {
		setBreakpoints(breakpoints: Breakpoint[]);
	}

	export interface Debugger {
		symbols:								SymbolLookup;
		breakpoints:							BreakpointsConfig;

		state():								State;
		threads():								Thread[];
		memory(start: number, size: number):	number[];

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
	export function cloneSourceLocation			(sl: SourceLocation): SourceLocation { return { file: sl.file, line: sl.line, column: sl.column }; }
	export function sourceLocationEqualColumn	(a: SourceLocation, b: SourceLocation) { return a.file === b.file && a.line === b.line && a.column === b.column; }
	export function sourceLocationEqualLine		(a: SourceLocation, b: SourceLocation) { return a.file === b.file && a.line === b.line; }
	export function sourceLocationEqualFile		(a: SourceLocation, b: SourceLocation) { return a.file === b.file; }

	const reFileLine = /^(.+)(?:(?:\((\d+)\))|(?:\:(\d+)))$/;
	export function parseSourceLocation(text: string): SourceLocation {
		let m = reFileLine.exec(text);
		if (!m) return null;

		let file = m[1];
		let line = parseInt(m[2] || m[3]);
		return { file: m[1], line: parseInt(m[2] || m[3]), column: 0 };
	}

	export function sourceLocationToString(sl: SourceLocation): string {
		let s = sl.file;
		if (sl.line) {
			s += "(";
			s += sl.line.toString();
			if (sl.column) {
				s += ",";
				s += sl.column.toString();
			}
			s += ")";
		}
		return s;
	}
}

type Debugger = Debugger.Debugger;
