enum DebugState {
	Detatched,
	Paused,
	Running,
	Done,
}

interface Debugger {
	state(): DebugState;

	stop();					// Running, Paused	-> None
	continue();				// Paused			-> Running
	pause();				// Running			-> Paused
}
