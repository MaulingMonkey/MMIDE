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
        function update(theDebugger) {
            var els = document.getElementsByClassName("memory");
            for (var elI = 0; elI < els.length; ++elI) {
                var el = els.item(elI);
                var b = function (k) { var value = el.dataset[k]; console.assert(value !== undefined); return value === "1" || value === "true"; };
                var i = function (k) { var value = parseInt(el.dataset[k]); console.assert(value !== undefined && !isNaN(value) && isFinite(value)); return value; };
                var address = i("address");
                var colSize = i("colSize");
                var cols = i("cols");
                var rows = i("rows");
                var showLittleEndian = b("littleEndian");
                var showAddress = b("showAddress");
                var showHex = b("showHex");
                var showData = b("showData");
                //console.log(colSize, cols, rows, showHex, showData);
                var memory = theDebugger === undefined ? [] : theDebugger.memory();
                var getByte = function (row, col, byte, littleEndian) { return memory[address + (littleEndian ? colSize - byte - 1 : byte) + colSize * (col + cols * row)] || 0; }; // TODO: Fix endian calc
                var fullBuf = "";
                for (var rowI = 0; rowI < rows; ++rowI) {
                    var lineBuf = rowI === 0 ? "" : "\n";
                    if (showAddress) {
                        var a = (address + colSize * cols * rowI).toString(16);
                        var pad = "0x00000000";
                        lineBuf += pad.substr(0, pad.length - a.length) + a + "    ";
                    }
                    if (showHex) {
                        for (var colI = 0; colI < cols; ++colI) {
                            if (colI != 0)
                                lineBuf += " ";
                            for (var byteI = 0; byteI < colSize; ++byteI) {
                                var v = getByte(rowI, colI, byteI, showLittleEndian);
                                var sv = v.toString(16);
                                if (sv.length == 1)
                                    lineBuf += "0";
                                lineBuf += sv;
                            }
                        }
                        lineBuf += "    ";
                    }
                    if (showData)
                        for (var colI = 0; colI < cols; ++colI) {
                            var offset = colSize * (colI + (cols * rowI));
                            for (var byteI = 0; byteI < colSize; ++byteI) {
                                var v = getByte(rowI, colI, byteI, false);
                                var sv = (32 <= v && v < 127) ? String.fromCharCode(v) : "."; // XXX: Abuse unicode? 127 = DEL, probably bad.  
                                lineBuf += sv;
                            }
                        }
                    fullBuf += lineBuf;
                }
                el.textContent = fullBuf;
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