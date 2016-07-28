var Examples;
(function (Examples) {
    function LoadExample(example) {
        var eds = document.getElementsByClassName("editor");
        console.assert(eds.length === 1);
        var ed = eds.item(0);
        ed.textContent = example;
    }
    addEventListener("load", function (e) {
        LoadBrainfuckMandelbrot();
        UI.Debug.Start(false);
    });
    function LoadBrainfuckMandelbrot() {
        LoadExample("Mandelbrot Set Brainfuck Example:\n\n+++++++++++++[->++>>>+++++>++>+<<<<<<]>>>>>++++++>--->>>>>>>>>>+++++++++++++++[[\n>>>>>>>>>]+[<<<<<<<<<]>>>>>>>>>-]+[>>>>>>>>[-]>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>[-]+\n<<<<<<<+++++[-[->>>>>>>>>+<<<<<<<<<]>>>>>>>>>]>>>>>>>+>>>>>>>>>>>>>>>>>>>>>>>>>>\n>+<<<<<<<<<<<<<<<<<[<<<<<<<<<]>>>[-]+[>>>>>>[>>>>>>>[-]>>]<<<<<<<<<[<<<<<<<<<]>>\n>>>>>[-]+<<<<<<++++[-[->>>>>>>>>+<<<<<<<<<]>>>>>>>>>]>>>>>>+<<<<<<+++++++[-[->>>\n>>>>>>+<<<<<<<<<]>>>>>>>>>]>>>>>>+<<<<<<<<<<<<<<<<[<<<<<<<<<]>>>[[-]>>>>>>[>>>>>\n>>[-<<<<<<+>>>>>>]<<<<<<[->>>>>>+<<+<<<+<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>\n[>>>>>>>>[-<<<<<<<+>>>>>>>]<<<<<<<[->>>>>>>+<<+<<<+<<]>>>>>>>>]<<<<<<<<<[<<<<<<<\n<<]>>>>>>>[-<<<<<<<+>>>>>>>]<<<<<<<[->>>>>>>+<<+<<<<<]>>>>>>>>>+++++++++++++++[[\n>>>>>>>>>]+>[-]>[-]>[-]>[-]>[-]>[-]>[-]>[-]>[-]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>-]+[\n>+>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>->>>>[-<<<<+>>>>]<<<<[->>>>+<<<<<[->>[\n-<<+>>]<<[->>+>>+<<<<]+>>>>>>>>>]<<<<<<<<[<<<<<<<<<]]>>>>>>>>>[>>>>>>>>>]<<<<<<<\n<<[>[->>>>>>>>>+<<<<<<<<<]<<<<<<<<<<]>[->>>>>>>>>+<<<<<<<<<]<+>>>>>>>>]<<<<<<<<<\n[>[-]<->>>>[-<<<<+>[<->-<<<<<<+>>>>>>]<[->+<]>>>>]<<<[->>>+<<<]<+<<<<<<<<<]>>>>>\n>>>>[>+>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>->>>>>[-<<<<<+>>>>>]<<<<<[->>>>>+\n<<<<<<[->>>[-<<<+>>>]<<<[->>>+>+<<<<]+>>>>>>>>>]<<<<<<<<[<<<<<<<<<]]>>>>>>>>>[>>\n>>>>>>>]<<<<<<<<<[>>[->>>>>>>>>+<<<<<<<<<]<<<<<<<<<<<]>>[->>>>>>>>>+<<<<<<<<<]<<\n+>>>>>>>>]<<<<<<<<<[>[-]<->>>>[-<<<<+>[<->-<<<<<<+>>>>>>]<[->+<]>>>>]<<<[->>>+<<\n<]<+<<<<<<<<<]>>>>>>>>>[>>>>[-<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>\n>>>>>>>>>>>>>>>>>>>>>>>]>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>+++++++++++++++[[>>>>\n>>>>>]<<<<<<<<<-<<<<<<<<<[<<<<<<<<<]>>>>>>>>>-]+>>>>>>>>>>>>>>>>>>>>>+<<<[<<<<<<\n<<<]>>>>>>>>>[>>>[-<<<->>>]+<<<[->>>->[-<<<<+>>>>]<<<<[->>>>+<<<<<<<<<<<<<[<<<<<\n<<<<]>>>>[-]+>>>>>[>>>>>>>>>]>+<]]+>>>>[-<<<<->>>>]+<<<<[->>>>-<[-<<<+>>>]<<<[->\n>>+<<<<<<<<<<<<[<<<<<<<<<]>>>[-]+>>>>>>[>>>>>>>>>]>[-]+<]]+>[-<[>>>>>>>>>]<<<<<<\n<<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]<<<<<<<[->+>>>-<<<<]>>>>>>>>>+++++++++++++++++++\n+++++++>>[-<<<<+>>>>]<<<<[->>>>+<<[-]<<]>>[<<<<<<<+<[-<+>>>>+<<[-]]>[-<<[->+>>>-\n<<<<]>>>]>>>>>>>>>>>>>[>>[-]>[-]>[-]>>>>>]<<<<<<<<<[<<<<<<<<<]>>>[-]>>>>>>[>>>>>\n[-<<<<+>>>>]<<<<[->>>>+<<<+<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>>[-<<<<<<<<\n<+>>>>>>>>>]>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>+++++++++++++++[[>>>>>>>>>]+>[-\n]>[-]>[-]>[-]>[-]>[-]>[-]>[-]>[-]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>-]+[>+>>>>>>>>]<<<\n<<<<<<[<<<<<<<<<]>>>>>>>>>[>->>>>>[-<<<<<+>>>>>]<<<<<[->>>>>+<<<<<<[->>[-<<+>>]<\n<[->>+>+<<<]+>>>>>>>>>]<<<<<<<<[<<<<<<<<<]]>>>>>>>>>[>>>>>>>>>]<<<<<<<<<[>[->>>>\n>>>>>+<<<<<<<<<]<<<<<<<<<<]>[->>>>>>>>>+<<<<<<<<<]<+>>>>>>>>]<<<<<<<<<[>[-]<->>>\n[-<<<+>[<->-<<<<<<<+>>>>>>>]<[->+<]>>>]<<[->>+<<]<+<<<<<<<<<]>>>>>>>>>[>>>>>>[-<\n<<<<+>>>>>]<<<<<[->>>>>+<<<<+<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>+>>>>>>>>\n]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>->>>>>[-<<<<<+>>>>>]<<<<<[->>>>>+<<<<<<[->>[-<<+\n>>]<<[->>+>>+<<<<]+>>>>>>>>>]<<<<<<<<[<<<<<<<<<]]>>>>>>>>>[>>>>>>>>>]<<<<<<<<<[>\n[->>>>>>>>>+<<<<<<<<<]<<<<<<<<<<]>[->>>>>>>>>+<<<<<<<<<]<+>>>>>>>>]<<<<<<<<<[>[-\n]<->>>>[-<<<<+>[<->-<<<<<<+>>>>>>]<[->+<]>>>>]<<<[->>>+<<<]<+<<<<<<<<<]>>>>>>>>>\n[>>>>[-<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n]>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>>>[-<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<+>\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>]>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>++++++++\n+++++++[[>>>>>>>>>]<<<<<<<<<-<<<<<<<<<[<<<<<<<<<]>>>>>>>>>-]+[>>>>>>>>[-<<<<<<<+\n>>>>>>>]<<<<<<<[->>>>>>>+<<<<<<+<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>>>>>>[\n-]>>>]<<<<<<<<<[<<<<<<<<<]>>>>+>[-<-<<<<+>>>>>]>[-<<<<<<[->>>>>+<++<<<<]>>>>>[-<\n<<<<+>>>>>]<->+>]<[->+<]<<<<<[->>>>>+<<<<<]>>>>>>[-]<<<<<<+>>>>[-<<<<->>>>]+<<<<\n[->>>>->>>>>[>>[-<<->>]+<<[->>->[-<<<+>>>]<<<[->>>+<<<<<<<<<<<<[<<<<<<<<<]>>>[-]\n+>>>>>>[>>>>>>>>>]>+<]]+>>>[-<<<->>>]+<<<[->>>-<[-<<+>>]<<[->>+<<<<<<<<<<<[<<<<<\n<<<<]>>>>[-]+>>>>>[>>>>>>>>>]>[-]+<]]+>[-<[>>>>>>>>>]<<<<<<<<]>>>>>>>>]<<<<<<<<<\n[<<<<<<<<<]>>>>[-<<<<+>>>>]<<<<[->>>>+>>>>>[>+>>[-<<->>]<<[->>+<<]>>>>>>>>]<<<<<\n<<<+<[>[->>>>>+<<<<[->>>>-<<<<<<<<<<<<<<+>>>>>>>>>>>[->>>+<<<]<]>[->>>-<<<<<<<<<\n<<<<<+>>>>>>>>>>>]<<]>[->>>>+<<<[->>>-<<<<<<<<<<<<<<+>>>>>>>>>>>]<]>[->>>+<<<]<<\n<<<<<<<<<<]>>>>[-]<<<<]>>>[-<<<+>>>]<<<[->>>+>>>>>>[>+>[-<->]<[->+<]>>>>>>>>]<<<\n<<<<<+<[>[->>>>>+<<<[->>>-<<<<<<<<<<<<<<+>>>>>>>>>>[->>>>+<<<<]>]<[->>>>-<<<<<<<\n<<<<<<<+>>>>>>>>>>]<]>>[->>>+<<<<[->>>>-<<<<<<<<<<<<<<+>>>>>>>>>>]>]<[->>>>+<<<<\n]<<<<<<<<<<<]>>>>>>+<<<<<<]]>>>>[-<<<<+>>>>]<<<<[->>>>+>>>>>[>>>>>>>>>]<<<<<<<<<\n[>[->>>>>+<<<<[->>>>-<<<<<<<<<<<<<<+>>>>>>>>>>>[->>>+<<<]<]>[->>>-<<<<<<<<<<<<<<\n+>>>>>>>>>>>]<<]>[->>>>+<<<[->>>-<<<<<<<<<<<<<<+>>>>>>>>>>>]<]>[->>>+<<<]<<<<<<<\n<<<<<]]>[-]>>[-]>[-]>>>>>[>>[-]>[-]>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>>>>>[-<\n<<<+>>>>]<<<<[->>>>+<<<+<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>+++++++++++++++[\n[>>>>>>>>>]+>[-]>[-]>[-]>[-]>[-]>[-]>[-]>[-]>[-]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>-]+\n[>+>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>->>>>[-<<<<+>>>>]<<<<[->>>>+<<<<<[->>\n[-<<+>>]<<[->>+>+<<<]+>>>>>>>>>]<<<<<<<<[<<<<<<<<<]]>>>>>>>>>[>>>>>>>>>]<<<<<<<<\n<[>[->>>>>>>>>+<<<<<<<<<]<<<<<<<<<<]>[->>>>>>>>>+<<<<<<<<<]<+>>>>>>>>]<<<<<<<<<[\n>[-]<->>>[-<<<+>[<->-<<<<<<<+>>>>>>>]<[->+<]>>>]<<[->>+<<]<+<<<<<<<<<]>>>>>>>>>[\n>>>[-<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>]>\n>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>[-]>>>>+++++++++++++++[[>>>>>>>>>]<<<<<<<<<-<<<<<\n<<<<[<<<<<<<<<]>>>>>>>>>-]+[>>>[-<<<->>>]+<<<[->>>->[-<<<<+>>>>]<<<<[->>>>+<<<<<\n<<<<<<<<[<<<<<<<<<]>>>>[-]+>>>>>[>>>>>>>>>]>+<]]+>>>>[-<<<<->>>>]+<<<<[->>>>-<[-\n<<<+>>>]<<<[->>>+<<<<<<<<<<<<[<<<<<<<<<]>>>[-]+>>>>>>[>>>>>>>>>]>[-]+<]]+>[-<[>>\n>>>>>>>]<<<<<<<<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>[-<<<+>>>]<<<[->>>+>>>>>>[>+>>>\n[-<<<->>>]<<<[->>>+<<<]>>>>>>>>]<<<<<<<<+<[>[->+>[-<-<<<<<<<<<<+>>>>>>>>>>>>[-<<\n+>>]<]>[-<<-<<<<<<<<<<+>>>>>>>>>>>>]<<<]>>[-<+>>[-<<-<<<<<<<<<<+>>>>>>>>>>>>]<]>\n[-<<+>>]<<<<<<<<<<<<<]]>>>>[-<<<<+>>>>]<<<<[->>>>+>>>>>[>+>>[-<<->>]<<[->>+<<]>>\n>>>>>>]<<<<<<<<+<[>[->+>>[-<<-<<<<<<<<<<+>>>>>>>>>>>[-<+>]>]<[-<-<<<<<<<<<<+>>>>\n>>>>>>>]<<]>>>[-<<+>[-<-<<<<<<<<<<+>>>>>>>>>>>]>]<[-<+>]<<<<<<<<<<<<]>>>>>+<<<<<\n]>>>>>>>>>[>>>[-]>[-]>[-]>>>>]<<<<<<<<<[<<<<<<<<<]>>>[-]>[-]>>>>>[>>>>>>>[-<<<<<\n<+>>>>>>]<<<<<<[->>>>>>+<<<<+<<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>+>[-<-<<<<+>>>>\n>]>>[-<<<<<<<[->>>>>+<++<<<<]>>>>>[-<<<<<+>>>>>]<->+>>]<<[->>+<<]<<<<<[->>>>>+<<\n<<<]+>>>>[-<<<<->>>>]+<<<<[->>>>->>>>>[>>>[-<<<->>>]+<<<[->>>-<[-<<+>>]<<[->>+<<\n<<<<<<<<<[<<<<<<<<<]>>>>[-]+>>>>>[>>>>>>>>>]>+<]]+>>[-<<->>]+<<[->>->[-<<<+>>>]<\n<<[->>>+<<<<<<<<<<<<[<<<<<<<<<]>>>[-]+>>>>>>[>>>>>>>>>]>[-]+<]]+>[-<[>>>>>>>>>]<\n<<<<<<<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>[-<<<+>>>]<<<[->>>+>>>>>>[>+>[-<->]<[->+\n<]>>>>>>>>]<<<<<<<<+<[>[->>>>+<<[->>-<<<<<<<<<<<<<+>>>>>>>>>>[->>>+<<<]>]<[->>>-\n<<<<<<<<<<<<<+>>>>>>>>>>]<]>>[->>+<<<[->>>-<<<<<<<<<<<<<+>>>>>>>>>>]>]<[->>>+<<<\n]<<<<<<<<<<<]>>>>>[-]>>[-<<<<<<<+>>>>>>>]<<<<<<<[->>>>>>>+<<+<<<<<]]>>>>[-<<<<+>\n>>>]<<<<[->>>>+>>>>>[>+>>[-<<->>]<<[->>+<<]>>>>>>>>]<<<<<<<<+<[>[->>>>+<<<[->>>-\n<<<<<<<<<<<<<+>>>>>>>>>>>[->>+<<]<]>[->>-<<<<<<<<<<<<<+>>>>>>>>>>>]<<]>[->>>+<<[\n->>-<<<<<<<<<<<<<+>>>>>>>>>>>]<]>[->>+<<]<<<<<<<<<<<<]]>>>>[-]<<<<]>>>>[-<<<<+>>\n>>]<<<<[->>>>+>[-]>>[-<<<<<<<+>>>>>>>]<<<<<<<[->>>>>>>+<<+<<<<<]>>>>>>>>>[>>>>>>\n>>>]<<<<<<<<<[>[->>>>+<<<[->>>-<<<<<<<<<<<<<+>>>>>>>>>>>[->>+<<]<]>[->>-<<<<<<<<\n<<<<<+>>>>>>>>>>>]<<]>[->>>+<<[->>-<<<<<<<<<<<<<+>>>>>>>>>>>]<]>[->>+<<]<<<<<<<<\n<<<<]]>>>>>>>>>[>>[-]>[-]>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>[-]>[-]>>>>>[>>>>>[-<<<<+\n>>>>]<<<<[->>>>+<<<+<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>>>>>>[-<<<<<+>>>>>\n]<<<<<[->>>>>+<<<+<<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>+++++++++++++++[[>>>>\n>>>>>]+>[-]>[-]>[-]>[-]>[-]>[-]>[-]>[-]>[-]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>-]+[>+>>\n>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>->>>>[-<<<<+>>>>]<<<<[->>>>+<<<<<[->>[-<<+\n>>]<<[->>+>>+<<<<]+>>>>>>>>>]<<<<<<<<[<<<<<<<<<]]>>>>>>>>>[>>>>>>>>>]<<<<<<<<<[>\n[->>>>>>>>>+<<<<<<<<<]<<<<<<<<<<]>[->>>>>>>>>+<<<<<<<<<]<+>>>>>>>>]<<<<<<<<<[>[-\n]<->>>>[-<<<<+>[<->-<<<<<<+>>>>>>]<[->+<]>>>>]<<<[->>>+<<<]<+<<<<<<<<<]>>>>>>>>>\n[>+>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>->>>>>[-<<<<<+>>>>>]<<<<<[->>>>>+<<<<\n<<[->>>[-<<<+>>>]<<<[->>>+>+<<<<]+>>>>>>>>>]<<<<<<<<[<<<<<<<<<]]>>>>>>>>>[>>>>>>\n>>>]<<<<<<<<<[>>[->>>>>>>>>+<<<<<<<<<]<<<<<<<<<<<]>>[->>>>>>>>>+<<<<<<<<<]<<+>>>\n>>>>>]<<<<<<<<<[>[-]<->>>>[-<<<<+>[<->-<<<<<<+>>>>>>]<[->+<]>>>>]<<<[->>>+<<<]<+\n<<<<<<<<<]>>>>>>>>>[>>>>[-<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>>\n>>>>>>>>>>>>>>>>>>>]>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>+++++++++++++++[[>>>>>>>>\n>]<<<<<<<<<-<<<<<<<<<[<<<<<<<<<]>>>>>>>>>-]+>>>>>>>>>>>>>>>>>>>>>+<<<[<<<<<<<<<]\n>>>>>>>>>[>>>[-<<<->>>]+<<<[->>>->[-<<<<+>>>>]<<<<[->>>>+<<<<<<<<<<<<<[<<<<<<<<<\n]>>>>[-]+>>>>>[>>>>>>>>>]>+<]]+>>>>[-<<<<->>>>]+<<<<[->>>>-<[-<<<+>>>]<<<[->>>+<\n<<<<<<<<<<<[<<<<<<<<<]>>>[-]+>>>>>>[>>>>>>>>>]>[-]+<]]+>[-<[>>>>>>>>>]<<<<<<<<]>\n>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>->>[-<<<<+>>>>]<<<<[->>>>+<<[-]<<]>>]<<+>>>>[-<<<<\n->>>>]+<<<<[->>>>-<<<<<<.>>]>>>>[-<<<<<<<.>>>>>>>]<<<[-]>[-]>[-]>[-]>[-]>[-]>>>[\n>[-]>[-]>[-]>[-]>[-]>[-]>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>>>>>[-]>>>>]<<<<<<<<<\n[<<<<<<<<<]>+++++++++++[-[->>>>>>>>>+<<<<<<<<<]>>>>>>>>>]>>>>+>>>>>>>>>+<<<<<<<<\n<<<<<<[<<<<<<<<<]>>>>>>>[-<<<<<<<+>>>>>>>]<<<<<<<[->>>>>>>+[-]>>[>>>>>>>>>]<<<<<\n<<<<[>>>>>>>[-<<<<<<+>>>>>>]<<<<<<[->>>>>>+<<<<<<<[<<<<<<<<<]>>>>>>>[-]+>>>]<<<<\n<<<<<<]]>>>>>>>[-<<<<<<<+>>>>>>>]<<<<<<<[->>>>>>>+>>[>+>>>>[-<<<<->>>>]<<<<[->>>\n>+<<<<]>>>>>>>>]<<+<<<<<<<[>>>>>[->>+<<]<<<<<<<<<<<<<<]>>>>>>>>>[>>>>>>>>>]<<<<<\n<<<<[>[-]<->>>>>>>[-<<<<<<<+>[<->-<<<+>>>]<[->+<]>>>>>>>]<<<<<<[->>>>>>+<<<<<<]<\n+<<<<<<<<<]>>>>>>>-<<<<[-]+<<<]+>>>>>>>[-<<<<<<<->>>>>>>]+<<<<<<<[->>>>>>>->>[>>\n>>>[->>+<<]>>>>]<<<<<<<<<[>[-]<->>>>>>>[-<<<<<<<+>[<->-<<<+>>>]<[->+<]>>>>>>>]<<\n<<<<[->>>>>>+<<<<<<]<+<<<<<<<<<]>+++++[-[->>>>>>>>>+<<<<<<<<<]>>>>>>>>>]>>>>+<<<\n<<[<<<<<<<<<]>>>>>>>>>[>>>>>[-<<<<<->>>>>]+<<<<<[->>>>>->>[-<<<<<<<+>>>>>>>]<<<<\n<<<[->>>>>>>+<<<<<<<<<<<<<<<<[<<<<<<<<<]>>>>[-]+>>>>>[>>>>>>>>>]>+<]]+>>>>>>>[-<\n<<<<<<->>>>>>>]+<<<<<<<[->>>>>>>-<<[-<<<<<+>>>>>]<<<<<[->>>>>+<<<<<<<<<<<<<<[<<<\n<<<<<<]>>>[-]+>>>>>>[>>>>>>>>>]>[-]+<]]+>[-<[>>>>>>>>>]<<<<<<<<]>>>>>>>>]<<<<<<<\n<<[<<<<<<<<<]>>>>[-]<<<+++++[-[->>>>>>>>>+<<<<<<<<<]>>>>>>>>>]>>>>-<<<<<[<<<<<<<\n<<]]>>>]<<<<.>>>>>>>>>>[>>>>>>[-]>>>]<<<<<<<<<[<<<<<<<<<]>++++++++++[-[->>>>>>>>\n>+<<<<<<<<<]>>>>>>>>>]>>>>>+>>>>>>>>>+<<<<<<<<<<<<<<<[<<<<<<<<<]>>>>>>>>[-<<<<<<\n<<+>>>>>>>>]<<<<<<<<[->>>>>>>>+[-]>[>>>>>>>>>]<<<<<<<<<[>>>>>>>>[-<<<<<<<+>>>>>>\n>]<<<<<<<[->>>>>>>+<<<<<<<<[<<<<<<<<<]>>>>>>>>[-]+>>]<<<<<<<<<<]]>>>>>>>>[-<<<<<\n<<<+>>>>>>>>]<<<<<<<<[->>>>>>>>+>[>+>>>>>[-<<<<<->>>>>]<<<<<[->>>>>+<<<<<]>>>>>>\n>>]<+<<<<<<<<[>>>>>>[->>+<<]<<<<<<<<<<<<<<<]>>>>>>>>>[>>>>>>>>>]<<<<<<<<<[>[-]<-\n>>>>>>>>[-<<<<<<<<+>[<->-<<+>>]<[->+<]>>>>>>>>]<<<<<<<[->>>>>>>+<<<<<<<]<+<<<<<<\n<<<]>>>>>>>>-<<<<<[-]+<<<]+>>>>>>>>[-<<<<<<<<->>>>>>>>]+<<<<<<<<[->>>>>>>>->[>>>\n>>>[->>+<<]>>>]<<<<<<<<<[>[-]<->>>>>>>>[-<<<<<<<<+>[<->-<<+>>]<[->+<]>>>>>>>>]<<\n<<<<<[->>>>>>>+<<<<<<<]<+<<<<<<<<<]>+++++[-[->>>>>>>>>+<<<<<<<<<]>>>>>>>>>]>>>>>\n+>>>>>>>>>>>>>>>>>>>>>>>>>>>+<<<<<<[<<<<<<<<<]>>>>>>>>>[>>>>>>[-<<<<<<->>>>>>]+<\n<<<<<[->>>>>>->>[-<<<<<<<<+>>>>>>>>]<<<<<<<<[->>>>>>>>+<<<<<<<<<<<<<<<<<[<<<<<<<\n<<]>>>>[-]+>>>>>[>>>>>>>>>]>+<]]+>>>>>>>>[-<<<<<<<<->>>>>>>>]+<<<<<<<<[->>>>>>>>\n-<<[-<<<<<<+>>>>>>]<<<<<<[->>>>>>+<<<<<<<<<<<<<<<[<<<<<<<<<]>>>[-]+>>>>>>[>>>>>>\n>>>]>[-]+<]]+>[-<[>>>>>>>>>]<<<<<<<<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>[-]<<<++++\n+[-[->>>>>>>>>+<<<<<<<<<]>>>>>>>>>]>>>>>->>>>>>>>>>>>>>>>>>>>>>>>>>>-<<<<<<[<<<<\n<<<<<]]>>>]");
    }
    Examples.LoadBrainfuckMandelbrot = LoadBrainfuckMandelbrot;
    function LoadBrainfuckHelloWorld() {
        LoadExample("Hello World Brainfuck Example:\n\n++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.");
    }
    Examples.LoadBrainfuckHelloWorld = LoadBrainfuckHelloWorld;
})(Examples || (Examples = {}));
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
        //console.log("Ran",instructionsRan,"instructions (IP=", vm.codePtr, "(", vm.code[vm.codePtr],") DP=", vm.dataPtr, "(", vm.data[vm.dataPtr] ,"))");
    }
    function createDebugger(code, stdout) {
        var vm = createVm(code);
        var runHandle = undefined;
        var doPause = function () { if (runHandle !== undefined)
            clearInterval(runHandle); runHandle = undefined; };
        var doContinue = function () { if (runHandle === undefined)
            runHandle = setInterval(function () { return runSome(vm, 100000, stdout, doPause); }, 0); }; // Increase instruction limit after fixing loop perf?
        var doStop = function () { doPause(); vm.dataPtr = vm.data.length; };
        var getRegisters = function () { return [
            [" code", vm.codePtr.toString()],
            ["*code", (vm.code[vm.codePtr] || "??").replace("\n", "\\n").replace("\r", "\\r").toString()],
            [" data", vm.dataPtr.toString()],
            ["*data", (vm.data[vm.dataPtr] || "??").toString()],
        ]; };
        var getThreads = function () { return [{ registers: getRegisters }]; };
        var getMemory = function () { return vm.data; };
        var getState = function () {
            return vm === undefined ? DebugState.Detatched
                : vm.codePtr >= vm.code.length ? DebugState.Done
                    : runHandle !== undefined ? DebugState.Running
                        : DebugState.Paused;
        };
        return {
            state: getState,
            threads: getThreads,
            memory: getMemory,
            pause: doPause,
            continue: doContinue,
            stop: doStop,
        };
    }
    Brainfuck.createDebugger = createDebugger;
})(Brainfuck || (Brainfuck = {}));
var DebugState;
(function (DebugState) {
    DebugState[DebugState["Detatched"] = 0] = "Detatched";
    DebugState[DebugState["Paused"] = 1] = "Paused";
    DebugState[DebugState["Running"] = 2] = "Running";
    DebugState[DebugState["Done"] = 3] = "Done";
})(DebugState || (DebugState = {}));
var UI;
(function (UI) {
    var Debug;
    (function (Debug) {
        var theDebugger = undefined;
        function Start(paused) {
            UI.Output.outputs().forEach(function (o) { return o.clear(); });
            var editor = document.getElementsByClassName("editor");
            console.assert(editor.length == 1);
            theDebugger = Brainfuck.createDebugger(editor.item(0).textContent, function (stdout) {
                UI.Output.outputs().forEach(function (o) { return o.write(stdout); });
            });
            if (!paused)
                theDebugger.continue();
            setDebugState(theDebugger.state());
        }
        Debug.Start = Start;
        function Stop() {
            theDebugger.stop();
            theDebugger = undefined;
            setDebugState(DebugState.Detatched);
        }
        Debug.Stop = Stop;
        function Continue() {
            theDebugger.continue();
            setDebugState(theDebugger.state());
        }
        Debug.Continue = Continue;
        function Pause() {
            theDebugger.pause();
            setDebugState(theDebugger.state());
        }
        Debug.Pause = Pause;
        function Restart(paused) {
            if (theDebugger !== undefined)
                Stop();
            Start(paused);
        }
        Debug.Restart = Restart;
        function toggleClassVisibility(class_, visible) {
            var es = document.getElementsByClassName(class_);
            //console.log(class_, "(", es.length, ") :=", visible);
            for (var i = 0; i < es.length; ++i) {
                var e = es.item(i);
                e.style.display = visible ? "" : "none";
            }
        }
        var prevState = undefined;
        function setDebugState(state) {
            if (prevState == state)
                return;
            var styles = "debug-state-detatched debug-state-done debug-state-running debug-state-paused".split(' ');
            var visibleStyle = "";
            switch (state) {
                case DebugState.Detatched:
                    visibleStyle = "debug-state-detatched";
                    break;
                case DebugState.Done:
                    visibleStyle = "debug-state-done";
                    break;
                case DebugState.Running:
                    visibleStyle = "debug-state-running";
                    break;
                case DebugState.Paused:
                    visibleStyle = "debug-state-paused";
                    break;
            }
            console.log("state :=", visibleStyle);
            //console.assert(styles.indexOf(visibleStyle) !== -1);
            styles.forEach(function (style) { if (style !== visibleStyle)
                toggleClassVisibility(style, false); });
            toggleClassVisibility(visibleStyle, true);
            prevState = state;
        }
        addEventListener("load", function (e) {
            if (prevState === undefined)
                setDebugState(DebugState.Detatched);
            setInterval(function () {
                setDebugState(theDebugger === undefined ? DebugState.Detatched : theDebugger.state());
                UI.Registers.update(theDebugger === undefined ? [] : theDebugger.threads()[0].registers());
                UI.Memory.update(theDebugger);
            }, 1 / 60);
        });
    })(Debug = UI.Debug || (UI.Debug = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Memory;
    (function (Memory) {
        var fancyTransitions = false;
        var fasterTransitions = false;
        var DataChangedDisplay;
        (function (DataChangedDisplay) {
            DataChangedDisplay[DataChangedDisplay["None"] = 0] = "None";
            DataChangedDisplay[DataChangedDisplay["DelayHighlight"] = 1] = "DelayHighlight";
            DataChangedDisplay[DataChangedDisplay["DurationHighlight"] = 2] = "DurationHighlight";
        })(DataChangedDisplay || (DataChangedDisplay = {}));
        function getMemoryViewConfig(el) {
            var bool = function (k) { var value = el.dataset[k]; console.assert(value !== undefined && value !== null); return value === "1" || value === "true"; };
            var string = function (k) { var value = el.dataset[k]; console.assert(value !== undefined && value !== null); return value; };
            var int = function (k) { var value = parseInt(el.dataset[k]); console.assert(value !== undefined && value !== null && !isNaN(value) && isFinite(value)); return value; };
            return {
                baseAddress: int("address"),
                nColSize: int("colSize"),
                nCols: int("cols"),
                nRows: int("rows"),
                showLittleEndian: bool("littleEndian"),
                showAddress: bool("showAddress"),
                showHex: bool("showHex"),
                showData: bool("showData"),
                dataChangedDisplay: DataChangedDisplay[string("changedDisplay")],
            };
        }
        function getByte(memory, config, rowI, colI, byteI, littleEndian) {
            return memory[config.baseAddress + (littleEndian ? config.nColSize - byteI - 1 : byteI) + config.nColSize * (colI + config.nCols * rowI)] || 0;
        }
        function appendAddressCell(rowCells, config, rowI) {
            if (config.showAddress) {
                var a = (config.baseAddress + config.nColSize * config.nCols * rowI).toString(16);
                var pad = "0x00000000";
                rowCells.push({ type: "memory-cell-address", display: pad.substr(0, pad.length - a.length) + a, data: a });
            }
        }
        function appendHexCells(rowCells, config, rowI, memory) {
            for (var colI = 0; colI < config.nCols; ++colI) {
                var cellText = "";
                for (var byteI = 0; byteI < config.nColSize; ++byteI) {
                    var v = getByte(memory, config, rowI, colI, byteI, config.showLittleEndian);
                    var sv = v.toString(16);
                    if (sv.length == 1)
                        sv = "0" + sv;
                    cellText += sv;
                }
                if (rowCells.length)
                    rowCells.push({ type: "memory-cell-padding", display: " ", data: " " });
                rowCells.push({ type: "memory-cell-hex", display: cellText, data: cellText });
            }
        }
        function appendDataCells(rowCells, config, rowI, memory) {
            if (rowCells.length)
                rowCells.push({ type: "memory-cell-padding", display: " ", data: " " });
            for (var colI = 0; colI < config.nCols; ++colI) {
                var offset = config.nColSize * (colI + (config.nCols * rowI));
                for (var byteI = 0; byteI < config.nColSize; ++byteI) {
                    var v = getByte(memory, config, rowI, colI, byteI, false);
                    var cellText = (32 <= v && v < 127) ? String.fromCharCode(v) : "."; // XXX: Abuse unicode? 127 = DEL, probably bad.
                    var cellData = String.fromCharCode(v);
                    rowCells.push({ type: "memory-cell-data", display: cellText, data: cellData });
                }
            }
        }
        function collectTableCells(config, memory) {
            var table = [];
            for (var rowI = 0; rowI < config.nRows; ++rowI) {
                var row = [];
                if (config.showAddress)
                    appendAddressCell(row, config, rowI);
                if (config.showHex)
                    appendHexCells(row, config, rowI, memory);
                if (config.showData)
                    appendDataCells(row, config, rowI, memory);
                table.push(row);
            }
            return table;
        }
        function applyDataChangedTransition(config, d3cell) {
            var transitionId = "highlight-changed";
            d3cell.interrupt(transitionId);
            d3cell.style("background-color", "#F44");
            switch (config.dataChangedDisplay) {
                case DataChangedDisplay.DelayHighlight:
                    d3cell
                        .transition(transitionId).delay(30).duration(0).style("background-color", "#FAA")
                        .transition().delay(30).duration(0).style("background-color", "#ECC")
                        .transition().delay(30).duration(0).style("background-color", undefined);
                    break;
                case DataChangedDisplay.DurationHighlight:
                    d3cell
                        .transition(transitionId).duration(100).style("background-color", "#FAA")
                        .transition().duration(100).style("background-color", "#DDD")
                        .transition().style("background-color", undefined);
                    break;
            }
        }
        function d3UpdateTable(el, config, table) {
            var d3table = d3.select(el).select("table");
            if (d3table.empty())
                d3table = d3.select(el).append("table").style("border-collapse", "collapse");
            var d3rows = d3table.selectAll("tr").data(table);
            d3rows.enter().append("tr");
            d3rows.exit().remove();
            d3rows.each(function (rowData) {
                var rowElement = this;
                var d3cells = d3.select(rowElement).selectAll("td").data(rowData);
                d3cells.exit().remove();
                d3cells.enter().append("td");
                //d3cells.attr("class",	cellData => cellData.type);
                d3cells.text(function (cellData) { return cellData.display; });
                if (config.dataChangedDisplay) {
                    var prevStyle = undefined;
                    d3cells.each(function (cellData) {
                        var d3cell = d3.select(this);
                        var prevMemoryValue = d3cell.attr("data-memory-value");
                        d3cell.attr("data-memory-value", cellData.data);
                        var dataChanged = prevMemoryValue !== undefined && prevMemoryValue !== null && prevMemoryValue !== cellData.data;
                        if (dataChanged)
                            applyDataChangedTransition(config, d3cell);
                    });
                    d3cells.attr("data-memory-value", function (cd) { return cd.data; });
                }
            });
            d3rows.order();
        }
        function update(theDebugger) {
            var memory = theDebugger === undefined ? [] : theDebugger.memory();
            var getByte = function (row, col, byte, littleEndian) { return memory[config.baseAddress + (littleEndian ? config.nColSize - byte - 1 : byte) + config.nColSize * (col + config.nCols * row)] || 0; };
            var els = document.getElementsByClassName("memory");
            for (var elI = 0; elI < els.length; ++elI) {
                var el = els.item(elI);
                var config = getMemoryViewConfig(el);
                var table = collectTableCells(config, memory);
                d3UpdateTable(el, config, table);
            }
        }
        Memory.update = update;
    })(Memory = UI.Memory || (UI.Memory = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
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
    UI.Output = Output;
    ;
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Registers;
    (function (Registers) {
        function update(registers) {
            var flat = "";
            var lpad = "      ";
            var rpad = "      ";
            registers.forEach(function (reg) { return flat += reg[0] + lpad.substring(reg[0].length) + " := " + rpad.substring(reg[1].length) + reg[1] + "\n"; });
            flat = flat.substr(0, flat.length - 1);
            var els = document.getElementsByClassName("registers");
            for (var elI = 0; elI < els.length; ++elI) {
                var el = els.item(elI);
                el.textContent = flat;
            }
        }
        Registers.update = update;
    })(Registers = UI.Registers || (UI.Registers = {}));
})(UI || (UI = {}));
//# sourceMappingURL=mmide.js.map