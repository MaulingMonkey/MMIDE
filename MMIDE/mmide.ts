let debug : Debugger = undefined;

function restartBrainfuck(startPaused: boolean) {
	if (debug !== undefined) debug.stop();

	Output.outputs().forEach(o => o.clear());

	let editor = document.getElementsByClassName("editor");
	console.assert(editor.length == 1);
	debug = Brainfuck.createDebugger(editor.item(0).textContent, (stdout) => {
		Output.outputs().forEach(o => o.write(stdout));
	});
	if (!startPaused) debug.continue();
}

window.addEventListener("load", function(e) {
	restartBrainfuck(true);
});
