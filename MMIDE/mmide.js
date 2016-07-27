var DebugState;
(function (DebugState) {
    DebugState[DebugState["Detatched"] = 0] = "Detatched";
    DebugState[DebugState["Paused"] = 1] = "Paused";
    DebugState[DebugState["Running"] = 2] = "Running";
    DebugState[DebugState["Done"] = 3] = "Done";
})(DebugState || (DebugState = {}));
var Brainfuck;
(function (Brainfuck) {
    function createVm(code) {
        return {
            code: code,
            data: [],
            codePtr: 0,
            dataPtr: 0,
        };
    }
    function loopStart(vm) {
        if (!!vm.data[vm.dataPtr]) {
            ++vm.codePtr;
        }
        else {
            /* scan forward */
            var nested = 0;
            for (;;) {
                switch (vm.code[vm.codePtr++]) {
                    case "[":
                        ++nested;
                        break;
                    case "]":
                        if (--nested === 0)
                            return;
                        break;
                    case undefined: return;
                }
            }
        }
    }
    function loopEnd(vm) {
        if (!vm.data[vm.dataPtr]) {
            ++vm.codePtr;
        }
        else {
            /* scan back */
            var nested = 0;
            for (;;) {
                switch (vm.code[vm.codePtr--]) {
                    case "]":
                        ++nested;
                        break;
                    case "[":
                        if (--nested === 0) {
                            vm.codePtr += 1;
                            return;
                        }
                        break;
                    case undefined:
                        vm.codePtr = vm.code.length;
                        break;
                }
            }
        }
    }
    function runSome(vm, maxInstructions, stdout, stop) {
        var stdoutBuf = "";
        for (var instructionsRan = 0; instructionsRan < maxInstructions; ++instructionsRan) {
            switch (vm.code[vm.codePtr]) {
                case "<":
                    --vm.dataPtr;
                    ++vm.codePtr;
                    break;
                case ">":
                    ++vm.dataPtr;
                    ++vm.codePtr;
                    break;
                case "+":
                    vm.data[vm.dataPtr] = ((vm.data[vm.dataPtr] || 0) + 1) % 256;
                    ++vm.codePtr;
                    break;
                case "-":
                    vm.data[vm.dataPtr] = ((vm.data[vm.dataPtr] || 0) + 255) % 256;
                    ++vm.codePtr;
                    break;
                //case ".":		stdout((vm.data[vm.dataPtr] || 0).toString()+" ");		++vm.codePtr; break;
                case ".":
                    stdout(String.fromCharCode(vm.data[vm.dataPtr] || 0));
                    ++vm.codePtr;
                    break;
                case ",":
                    vm.data[vm.dataPtr] = 0; /* Input not yet supported */
                    ++vm.codePtr;
                    break;
                case "[":
                    loopStart(vm);
                    break;
                case "]":
                    loopEnd(vm);
                    break;
                case undefined:
                    stop();
                    break;
                default:
                    ++vm.codePtr;
                    break;
            }
        }
        console.log("Ran", instructionsRan, "instructions (IP=", vm.codePtr, "(", vm.code[vm.codePtr], ") DP=", vm.dataPtr, "(", vm.data[vm.dataPtr], "))");
    }
    function createDebugger(code, stdout) {
        var vm = createVm(code);
        var runHandle = undefined;
        var doPause = function () { if (runHandle !== undefined)
            clearInterval(runHandle); runHandle = undefined; };
        var doContinue = function () { if (runHandle === undefined)
            runHandle = setInterval(function () { return runSome(vm, 1000000, stdout, doPause); }, 0); }; // Increase instruction limit after fixing loop perf?
        var doStop = function () { doPause(); vm.dataPtr = vm.data.length; };
        var getState = function () {
            return vm === undefined ? DebugState.Detatched
                : vm.dataPtr >= vm.data.length ? DebugState.Done
                    : runHandle !== undefined ? DebugState.Running
                        : DebugState.Paused;
        };
        return {
            state: getState,
            pause: doPause,
            continue: doContinue,
            stop: doStop,
        };
    }
    Brainfuck.createDebugger = createDebugger;
})(Brainfuck || (Brainfuck = {}));
var debug = undefined;
function restartBrainfuck(startPaused) {
    if (debug !== undefined)
        debug.stop();
    Output.outputs().forEach(function (o) { return o.clear(); });
    var editor = document.getElementsByClassName("editor");
    console.assert(editor.length == 1);
    debug = Brainfuck.createDebugger(editor.item(0).textContent, function (stdout) {
        Output.outputs().forEach(function (o) { return o.write(stdout); });
    });
    if (!startPaused)
        debug.continue();
}
window.addEventListener("load", function (e) {
    restartBrainfuck(true);
});
var Output = (function () {
    function Output(element) {
        this._element = element;
        this._col = 0;
    }
    Output.prototype.write = function (data) {
        //let maxCol = 120; // TODO: Replace with this.element data?
        var maxCol = 180; // TODO: Replace with this.element data?
        var col = this._col;
        data = data.replace("\r", ""); // only care about \n
        var i = 0;
        var buf = "";
        while (i < data.length) {
            var nextSplit = data.indexOf("\n", i);
            if (nextSplit === -1)
                nextSplit = data.length;
            while (i < nextSplit) {
                console.assert(col <= maxCol - 1);
                var append = data.substr(i, Math.min(nextSplit - i, maxCol - col));
                console.assert(append.length >= 1);
                buf += append;
                col += append.length;
                i += append.length;
                if (col == maxCol) {
                    buf += "\n";
                    col = 0;
                }
            }
            if (nextSplit < data.length) {
                buf += "\n";
                col = 0;
            }
            console.assert(i === nextSplit);
            i = nextSplit + 1; // skip EOL
        }
        this._element.textContent += buf;
        this._col = col;
    };
    Output.prototype.clear = function () {
        this._element.textContent = "";
        this._col = 0;
    };
    Output.outputs = function () {
        var outputElements = [];
        var _outputElements = document.getElementsByClassName("output");
        for (var i = 0; i < _outputElements.length; ++i)
            outputElements.push(_outputElements.item(i));
        outputElements.forEach(function (e) {
            if (!Output._outputs.some(function (o) { return o._element === e; })) {
                Output._outputs.push(new Output(e));
            }
        });
        Output._outputs = Output._outputs.filter(function (o) { return outputElements.indexOf(o._element) !== -1; });
        return Output._outputs;
    };
    Output._outputs = [];
    return Output;
})();
;
//# sourceMappingURL=mmide.js.map