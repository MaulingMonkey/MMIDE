﻿enum DebugState {
	Detatched,
	Paused,
	Running,
	Done,
}

type RegistersList = [string,string][];

interface DebuggerThread {
	registers():	RegistersList;
}

interface Debugger {
	state():		DebugState;
	threads():		DebuggerThread[];
	memory():		number[];

	stop();					// Running, Paused	-> None
	continue();				// Paused			-> Running
	pause();				// Running			-> Paused
}
