var _brainfuck_vm_global = this;
var _brainfuck_vm_document = this["document"];
var Brainfuck;
(function (Brainfuck) {
    var VmCompiler;
    (function (VmCompiler) {
        var isWorker = !_brainfuck_vm_document;
        var isMainTab = !isWorker;
        var supportsWorker = _brainfuck_vm_global["Worker"];
        function createAsyncDebugger(code, stdout) {
            console.assert(isMainTab);
            if (!isMainTab)
                return undefined;
            if (!supportsWorker)
                return VmCompiler.createDebugger(code, stdout);
            var errors = false;
            var parseResult = Brainfuck.AST.parse({ code: code, onError: function (e) { if (e.severity == Brainfuck.AST.ErrorSeverity.Error)
                    errors = true; } });
            if (errors)
                return undefined;
            var program = VmCompiler.compileProgram(parseResult.optimizedAst);
            var vm = {
                code: program,
                data: [],
                codePtr: 0,
                dataPtr: 0,
                sysCalls: [],
                insRan: 0,
                runTime: 0,
                wallStart: Date.now(),
            };
            var state = Debugger.State.Paused;
            var worker = new Worker("mmide.js");
            worker.addEventListener("message", function (reply) {
                switch (reply.data.desc) {
                    case "update-state":
                        state = reply.data.value;
                        break;
                    case "update-vm-data":
                        var src = reply.data.value;
                        vm.data = src.data;
                        vm.codePtr = src.codePtr;
                        vm.dataPtr = src.dataPtr;
                        vm.insRan = src.insRan;
                        vm.runTime = src.runTime;
                        break;
                    case "system-call-stdout":
                        stdout(reply.data.value);
                        break;
                    case "system-call-tape-end":
                        state = Debugger.State.Done;
                        break;
                    default:
                        console.error("Unexpected worker message desc:", reply.data.desc);
                        break;
                }
            });
            worker.postMessage({ desc: "brainfuck-debugger-init", state: vm });
            return {
                symbols: VmCompiler.createSymbolLookup(program),
                state: function () { return state; },
                threads: function () { return VmCompiler.getThreads(vm, code); },
                memory: function (start, size) { return vm.data.slice(start, start + size); },
                pause: function () { return worker.postMessage({ desc: "pause" }); },
                continue: function () { return worker.postMessage({ desc: "continue" }); },
                stop: function () { return worker.postMessage({ desc: "stop" }); },
                step: function () { return worker.postMessage({ desc: "step" }); },
            };
        }
        VmCompiler.createAsyncDebugger = createAsyncDebugger;
        if (isWorker) {
            var vm = undefined;
            var runHandle = undefined;
            var reply = _brainfuck_vm_global["postMessage"];
            function updateVm() {
                reply({ desc: "update-vm-data", value: { data: vm.data, codePtr: vm.codePtr, dataPtr: vm.dataPtr, insRan: vm.insRan, runTime: vm.runTime } });
            }
            function tick() {
                //runSome(vm, 100000); // ? - ~10ms - ~24M/s instructions executed
                VmCompiler.runSome(vm, 300000); // 5 - ~30ms? - ~68M/s instructions executed - significantly diminishing returns beyond this point
                //runSome(vm, 500000); // ? - ~50ms? - ~68M/s instructions executed - still seems perfectly responsive FWIW
                updateVm();
            }
            function onInitMessage(ev) {
                removeEventListener("message", onInitMessage);
                if (ev.data.desc != "brainfuck-debugger-init")
                    return;
                addEventListener("message", onMessage);
                vm = ev.data.state;
                vm.sysCalls[Brainfuck.AST.SystemCall.Putch] = function (vm) { reply({ desc: "system-call-stdout", value: String.fromCharCode(vm.data[vm.dataPtr]) }); };
                vm.sysCalls[Brainfuck.AST.SystemCall.TapeEnd] = function (vm) { reply({ desc: "system-call-tape-end" }); updateVm(); if (runHandle !== undefined)
                    clearInterval(runHandle); runHandle = undefined; };
            }
            function onMessage(ev) {
                switch (ev.data.desc) {
                    case "pause":
                        if (runHandle !== undefined)
                            clearInterval(runHandle);
                        runHandle = undefined;
                        reply({ desc: "update-state", value: Debugger.State.Paused });
                        break;
                    case "continue":
                        if (runHandle === undefined)
                            runHandle = setInterval(tick, 0);
                        reply({ desc: "update-state", value: Debugger.State.Running });
                        break;
                    case "stop":
                        if (runHandle !== undefined)
                            clearInterval(runHandle);
                        runHandle = undefined;
                        reply({ desc: "update-state", value: Debugger.State.Done });
                        break;
                    case "step":
                        VmCompiler.runOne(vm);
                        updateVm();
                        // no update-state
                        break;
                }
            }
            addEventListener("message", onInitMessage);
        }
    })(VmCompiler = Brainfuck.VmCompiler || (Brainfuck.VmCompiler = {}));
})(Brainfuck || (Brainfuck = {}));
var Brainfuck;
(function (Brainfuck) {
    var VmCompiler;
    (function (VmCompiler) {
        function compileProgram(ast) {
            var program = { ops: [], locs: [] };
            compile(program, ast);
            return program;
        }
        VmCompiler.compileProgram = compileProgram;
        function compile(program, ast) {
            for (var astI = 0; astI < ast.length; ++astI) {
                var node = ast[astI];
                var push = function (op) {
                    program.ops.push(op);
                    program.locs.push(node.location);
                };
                switch (node.type) {
                    case Brainfuck.AST.NodeType.AddDataPtr:
                        push({ type: VmCompiler.VmOpType.AddDataPtr, value: node.value || 0, dataOffset: 0 });
                        break;
                    case Brainfuck.AST.NodeType.AddData:
                        push({ type: VmCompiler.VmOpType.AddData, value: node.value || 0, dataOffset: node.dataOffset || 0 });
                        break;
                    case Brainfuck.AST.NodeType.SetData:
                        push({ type: VmCompiler.VmOpType.SetData, value: node.value || 0, dataOffset: node.dataOffset || 0 });
                        break;
                    case Brainfuck.AST.NodeType.SystemCall:
                        push({ type: VmCompiler.VmOpType.SystemCall, value: node.systemCall || 0, dataOffset: 0 });
                        break;
                    case Brainfuck.AST.NodeType.BreakIf:
                        var afterSystemCall = program.ops.length + 2;
                        push({ type: VmCompiler.VmOpType.JumpIfNot, value: afterSystemCall, dataOffset: 0 });
                        push({ type: VmCompiler.VmOpType.SystemCall, value: Brainfuck.AST.SystemCall.Break, dataOffset: 0 });
                        break;
                    case Brainfuck.AST.NodeType.Loop:
                        var firstJump = { type: VmCompiler.VmOpType.JumpIfNot, value: undefined, dataOffset: 0 };
                        push(firstJump);
                        var afterFirstJump = program.ops.length;
                        compile(program, node.childScope);
                        var lastJump = { type: VmCompiler.VmOpType.JumpIf, value: afterFirstJump, dataOffset: 0 };
                        push(lastJump);
                        var afterLastJump = program.ops.length;
                        firstJump.value = afterLastJump;
                        break;
                    default:
                        console.error("Invalid node.type :=", node.type);
                        break;
                }
            }
        }
    })(VmCompiler = Brainfuck.VmCompiler || (Brainfuck.VmCompiler = {}));
})(Brainfuck || (Brainfuck = {}));
var Brainfuck;
(function (Brainfuck) {
    var VmCompiler;
    (function (VmCompiler) {
        function createSymbolLookup(program) {
            return {
                addrToSourceLocation: function (address) { return program.locs[address]; },
                sourceLocationToAddr: function (sourceLocation) {
                    for (var i = 0; i < program.locs.length; ++i) {
                        if (Debugger.sourceLocationEqualColumn(sourceLocation, program.locs[i])) {
                            return i;
                        }
                    }
                },
            };
        }
        VmCompiler.createSymbolLookup = createSymbolLookup;
    })(VmCompiler = Brainfuck.VmCompiler || (Brainfuck.VmCompiler = {}));
})(Brainfuck || (Brainfuck = {}));
var Brainfuck;
(function (Brainfuck) {
    var VmCompiler;
    (function (VmCompiler) {
        function lpad(s, padding) { return padding.substr(0, padding.length - s.length) + s; }
        function addr(n) { return lpad(n.toString(16), "0x0000"); }
        function sourceLocationToString(sl) { return !sl ? "unknown" : (sl.file + "(" + lpad(sl.line.toString(), "   ") + ")"); }
        function getRegistersList(vm, src) {
            return [
                ["Registers:", ""],
                ["     code", addr(vm.codePtr)],
                ["    *code", VmCompiler.vmOpToString(vm.code.ops[vm.codePtr])],
                ["    @code", sourceLocationToString(vm.code.locs[vm.codePtr])],
                ["     data", addr(vm.dataPtr)],
                ["    *data", (vm.data[vm.dataPtr] || "0").toString()],
                ["------------------------------", ""],
                ["Performance:", ""],
                ["    ran  ", vm.insRan.toLocaleString()],
                [" VM ran/s", ((vm.insRan / vm.runTime) | 0).toLocaleString()],
                [" VM     s", (vm.runTime | 0).toString()],
                [" Wa.ran/s", ((vm.insRan / (Date.now() - vm.wallStart) * 1000) | 0).toLocaleString()],
                [" Wall   s", ((Date.now() - vm.wallStart) / 1000 | 0).toString()],
                ["------------------------------", ""],
                ["Code size:", ""],
                ["Brainfuck", src.length.toString()],
                [" Bytecode", vm.code.ops.length.toString()],
            ];
        }
        VmCompiler.getRegistersList = getRegistersList;
    })(VmCompiler = Brainfuck.VmCompiler || (Brainfuck.VmCompiler = {}));
})(Brainfuck || (Brainfuck = {}));
var Brainfuck;
(function (Brainfuck) {
    var VmCompiler;
    (function (VmCompiler) {
        function getThreads(vm, src) {
            return [{
                    registers: function () { return VmCompiler.getRegistersList(vm, src); },
                    currentPos: function () { return vm.codePtr; },
                }];
        }
        VmCompiler.getThreads = getThreads;
    })(VmCompiler = Brainfuck.VmCompiler || (Brainfuck.VmCompiler = {}));
})(Brainfuck || (Brainfuck = {}));
var Brainfuck;
(function (Brainfuck) {
    var VmCompiler;
    (function (VmCompiler) {
        function badSysCall(vm) {
            console.error("Unexpected VmOpType", VmCompiler.VmOpType[vm.code[vm.codePtr].type]);
            vm.sysCalls[Brainfuck.AST.SystemCall.TapeEnd](vm);
        }
        function runOne(vm) {
            var op = vm.code.ops[vm.codePtr];
            if (!op) {
                vm.sysCalls[Brainfuck.AST.SystemCall.TapeEnd](vm);
                return;
            }
            var dp = vm.dataPtr + (op.dataOffset || 0);
            switch (op.type) {
                case VmCompiler.VmOpType.AddDataPtr:
                    vm.dataPtr += op.value;
                    ++vm.codePtr;
                    break;
                case VmCompiler.VmOpType.AddData:
                    vm.data[dp] = (op.value + 256 + (vm.data[dp] || 0)) % 256;
                    ++vm.codePtr;
                    break;
                case VmCompiler.VmOpType.SetData:
                    vm.data[dp] = (op.value + 256) % 256;
                    ++vm.codePtr;
                    break;
                case VmCompiler.VmOpType.JumpIf:
                    if (vm.data[dp])
                        vm.codePtr = op.value;
                    else
                        ++vm.codePtr;
                    break;
                case VmCompiler.VmOpType.JumpIfNot:
                    if (!vm.data[dp])
                        vm.codePtr = op.value;
                    else
                        ++vm.codePtr;
                    break;
                case VmCompiler.VmOpType.SystemCall:
                    (vm.sysCalls[op.value] || badSysCall)(vm);
                    ++vm.codePtr;
                    break;
                default:
                    badSysCall(vm);
                    break;
            }
        }
        VmCompiler.runOne = runOne;
        function runSome(vm, maxInstructions) {
            var tStart = Date.now();
            for (var instructionsRan = 0; instructionsRan < maxInstructions; ++instructionsRan)
                runOne(vm);
            var tStop = Date.now();
            vm.insRan += instructionsRan;
            vm.runTime += (tStop - tStart) / 1000;
        }
        VmCompiler.runSome = runSome;
    })(VmCompiler = Brainfuck.VmCompiler || (Brainfuck.VmCompiler = {}));
})(Brainfuck || (Brainfuck = {}));
var Brainfuck;
(function (Brainfuck) {
    var VmCompiler;
    (function (VmCompiler) {
        function vmOpToString(op) {
            return !op ? "??" : VmCompiler.VmOpType[op.type] +
                (op.value ? (" (" + op.value + ")") : "") +
                (op.dataOffset ? ("@ " + op.dataOffset) : "");
        }
        VmCompiler.vmOpToString = vmOpToString;
    })(VmCompiler = Brainfuck.VmCompiler || (Brainfuck.VmCompiler = {}));
})(Brainfuck || (Brainfuck = {}));
var Brainfuck;
(function (Brainfuck) {
    var VmCompiler;
    (function (VmCompiler) {
        (function (VmOpType) {
            VmOpType[VmOpType["AddDataPtr"] = 0] = "AddDataPtr";
            VmOpType[VmOpType["AddData"] = 1] = "AddData";
            VmOpType[VmOpType["SetData"] = 2] = "SetData";
            VmOpType[VmOpType["SystemCall"] = 3] = "SystemCall";
            VmOpType[VmOpType["JumpIf"] = 4] = "JumpIf";
            VmOpType[VmOpType["JumpIfNot"] = 5] = "JumpIfNot";
        })(VmCompiler.VmOpType || (VmCompiler.VmOpType = {}));
        var VmOpType = VmCompiler.VmOpType;
    })(VmCompiler = Brainfuck.VmCompiler || (Brainfuck.VmCompiler = {}));
})(Brainfuck || (Brainfuck = {}));
var UI;
(function (UI) {
    var Breakpoints;
    (function (Breakpoints) {
        //const log = (m,...a) => console.log(m,...a);
        var log = function (m) {
            var a = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                a[_i - 1] = arguments[_i];
            }
        };
        function isBreakpointActive(breakpoint) {
            return breakpoint.enabled && !!breakpoint.location;
        }
        function isBreakpointBlank(breakpoint) {
            return !breakpoint.location && !breakpoint.condition && !breakpoint.onHit;
        }
        function isBreakpointCullable(breakpoint, ignoreFocus) {
            return isBreakpointBlank(breakpoint) && (ignoreFocus || !isBreakpointFocused(breakpoint));
        }
        function isBreakpointFocused(breakpoint) {
            if (!breakpoint.elements)
                return false;
            var active = document.activeElement;
            return active === breakpoint.elements.enabled ||
                active === breakpoint.elements.condition ||
                active === breakpoint.elements.location ||
                active === breakpoint.elements.onHit;
        }
        function newBreakpointRow(tableElement) {
            var d3body = d3.select(tableElement).select("tbody");
            if (d3body.empty())
                d3body = d3.select(tableElement).append("tbody");
            var newRow = d3body.append("tr");
            newRow.classed("breakpoint-row", true);
            var d3cols = d3.select(tableElement).select("thead").selectAll("[data-breakpoint-column]");
            d3cols.each(function () {
                var header = this;
                var colType = header.dataset["breakpointColumn"];
                var newCell = newRow.append("td");
                switch (colType) {
                    case "location":
                        newCell.append("input").classed("breakpoint-enabled", true).attr({ type: "checkbox", checked: "", title: "Enabled", alt: "Enabled" });
                        newCell.append("span").text(" ");
                        newCell.append("input").classed("breakpoint-location", true).attr({ type: "text", value: "", placeholder: "(no location)" });
                        break;
                    case "condition":
                        newCell.append("input").classed("breakpoint-condition", true).attr({ type: "text", value: "", placeholder: "(no condition)" });
                        break;
                    case "on-hit":
                        newCell.append("input").classed("breakpoint-on-hit", true).attr({ type: "text", value: "", placeholder: "(no action on hit)" });
                        break;
                    default:
                        console.error("Unexpected data-breakpoint-column:", colType);
                        break;
                }
            });
            var rowElement = newRow[0][0];
            return rowElement;
        }
        function getRowBreakpointElements(row) {
            var eEnabled = row.getElementsByClassName("breakpoint-enabled").item(0);
            var eLocation = row.getElementsByClassName("breakpoint-location").item(0);
            var eCondition = row.getElementsByClassName("breakpoint-condition").item(0);
            var eOnHit = row.getElementsByClassName("breakpoint-on-hit").item(0);
            var breakpointElements = {
                row: row,
                enabled: eEnabled,
                location: eLocation,
                condition: eCondition,
                onHit: eOnHit,
            };
            return breakpointElements;
        }
        function getTableBreakpointElements(tableElement) {
            var breakpointElements = [];
            d3.select(tableElement).select("tbody").selectAll(".breakpoint-row").each(function () {
                var row = this;
                breakpointElements.push(getRowBreakpointElements(row));
            });
            return breakpointElements;
        }
        function getTableBreakpoints(tableElement) {
            return getTableBreakpointElements(tableElement).map(function (elements) {
                return {
                    elements: elements,
                    enabled: elements.enabled.checked,
                    location: elements.location.value,
                    condition: elements.condition.value,
                    onHit: elements.onHit.value,
                };
            });
        }
        function manageSingleBlankBreakpoint(tableElement) {
            var breakpoints = getTableBreakpoints(tableElement);
            if (breakpoints.length == 0) {
                newBreakpointRow(tableElement);
            }
            else {
                var lastBreakpoint = breakpoints[breakpoints.length - 1];
                breakpoints.filter(function (bp) { return isBreakpointBlank(bp) && !isBreakpointFocused(bp) && bp != lastBreakpoint; }).forEach(function (e) { return e.elements.row.remove(); });
                if (!isBreakpointBlank(lastBreakpoint))
                    newBreakpointRow(tableElement);
            }
        }
        addEventListener("load", function () {
            var table = d3.select(".breakpoints").select("table")[0][0];
            if (!table)
                return;
            newBreakpointRow(table);
            setInterval(function () {
                manageSingleBlankBreakpoint(table);
            }, 100);
        });
    })(Breakpoints = UI.Breakpoints || (UI.Breakpoints = {}));
})(UI || (UI = {}));
function debounce(callback, waitMS) {
    var _this = this;
    var callNext = undefined;
    var wrapped = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (callNext === undefined) {
            setTimeout(function () {
                callNext.call.apply(callNext, [_this].concat(args));
                callNext = undefined;
            }, waitMS);
        }
        callNext = callback;
    };
    return wrapped;
}
var Examples;
(function (Examples) {
    function LoadExample(example) {
        UI.Editor.setScript(example);
    }
    addEventListener("load", function (e) {
        if (UI.Editor.isAvailable()) {
            LoadBrainfuckMandelbrot();
            UI.Debug.Start(false);
        }
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
// Intra-tab communications
var _itc_root = this;
var ITC;
(function (ITC) {
    //const log = (m, ...a) => {};
    var log = function (m) {
        var a = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            a[_i - 1] = arguments[_i];
        }
        return console.log.apply(console, [m].concat(a));
    };
    var htmlRefresh = 100;
    var noShortcut = true;
    function genSessionId() { return Math.random().toString(36).substr(2, 5); }
    function newSession() { tabSessionId = genSessionId(); console.log("Generating a new tab session:", tabSessionId); localStorage.setItem("current-session", tabSessionId); }
    ITC.newSession = newSession;
    if (_itc_root["localStorage"])
        addEventListener("focus", function (focusEvent) { console.log("Switching to", tabSessionId); localStorage.setItem("current-session", tabSessionId); });
    var tabSessionId = _itc_root["localStorage"] ? localStorage.getItem("current-session") : undefined;
    function cullHeaders() {
        var now = Date.now();
        for (var i = 0; i < localStorage.length; ++i) {
            var key = localStorage.key(i);
            if (key == "current-session")
                continue;
            var header = JSON.parse(localStorage.getItem(key));
            if (Math.abs(header._itc_last_updated - now) > 3000) {
                localStorage.removeItem(key); // Timeout
                log(key, "timed out and removed");
            }
            else {
            }
        }
    }
    if (_itc_root["localStorage"]) {
        cullHeaders();
        addEventListener("load", function (loadEvent) {
            setInterval(function () { return cullHeaders(); }, 10000);
        });
    }
    // TODO: Make culling automatic on sendToByClassName and listenToByClassName to reduce the chance of accidental leaks
    function peekAll(prefix) {
        prefix = tabSessionId + "-" + prefix;
        var now = Date.now();
        var headers = [];
        for (var i = 0; i < localStorage.length; ++i) {
            var key = localStorage.key(i);
            var matchesPrefix = key.substr(0, prefix.length) == prefix;
            if (matchesPrefix) {
                var header = JSON.parse(localStorage.getItem(key));
                headers.push(header);
            }
        }
        return headers;
    }
    ITC.peekAll = peekAll;
    function sendTo(key, header) {
        header._itc_last_updated = Date.now();
        var local = localOnHeader[key];
        if (local)
            local(header);
        if (!local || noShortcut)
            localStorage.setItem(tabSessionId + "-" + key, JSON.stringify(header));
    }
    ITC.sendTo = sendTo;
    function listenTo(key, onHeader) {
        localOnHeader[key] = onHeader;
        var existing = localStorage.getItem(tabSessionId + "-" + key);
        if (existing)
            onHeader(JSON.parse(existing));
    }
    ITC.listenTo = listenTo;
    function sendToByClassName(className, keyPrefix, eachElement) {
        var elements = UI.byClassName(className);
        elements.forEach(function (e) {
            var itcKey = getItcKey(e);
            sendTo(keyPrefix + itcKey, eachElement({ itcKey: itcKey, element: e }));
        });
    }
    ITC.sendToByClassName = sendToByClassName;
    function listenToByClassName(className, keyPrefix, onHeader) {
        var listening = [];
        var update = function () {
            var m = {};
            var elements = UI.byClassName(className);
            elements.forEach(function (e) {
                var itcKey = getItcKey(e);
                m[itcKey] = true;
                localOnHeader[keyPrefix + itcKey] = function (h) { return onHeader({ header: h, element: e }); };
            });
            listening.forEach(function (e) {
                var itcKey = getItcKey(e);
                if (!m[itcKey])
                    delete localOnHeader[keyPrefix + itcKey];
            });
            listening = elements;
        };
        update();
        setInterval(update, htmlRefresh);
    }
    ITC.listenToByClassName = listenToByClassName;
    var localOnHeader = {};
    function getItcKey(e) {
        var a = e;
        var key = a["__itc_key__"];
        if (key)
            return key;
        key = a["__itc_key__"] = Math.random().toString(36).substr(2, 5);
        return key;
    }
    addEventListener("storage", function (ev) {
        var tabSessionIdPrefix = tabSessionId + "-";
        if (ev.key.substr(0, tabSessionIdPrefix.length) != tabSessionIdPrefix)
            return;
        if (!ev.newValue)
            return;
        var key = ev.key.substr(tabSessionIdPrefix.length);
        var local = localOnHeader[key];
        if (!local)
            return;
        local(JSON.parse(ev.newValue));
    });
})(ITC || (ITC = {}));
var Brainfuck;
(function (Brainfuck) {
    var AST;
    (function (AST) {
        (function (NodeType) {
            NodeType[NodeType["AddDataPtr"] = 0] = "AddDataPtr";
            NodeType[NodeType["AddData"] = 1] = "AddData";
            NodeType[NodeType["SystemCall"] = 2] = "SystemCall";
            NodeType[NodeType["Loop"] = 3] = "Loop";
            // Psuedo-nodes generated by optimizer
            NodeType[NodeType["SetData"] = 4] = "SetData";
            NodeType[NodeType["BreakIf"] = 5] = "BreakIf";
        })(AST.NodeType || (AST.NodeType = {}));
        var NodeType = AST.NodeType;
        (function (SystemCall) {
            SystemCall[SystemCall["Break"] = 0] = "Break";
            SystemCall[SystemCall["Putch"] = 1] = "Putch";
            SystemCall[SystemCall["Getch"] = 2] = "Getch";
            SystemCall[SystemCall["TapeEnd"] = 3] = "TapeEnd";
        })(AST.SystemCall || (AST.SystemCall = {}));
        var SystemCall = AST.SystemCall;
        function nodeToString(node) {
            return NodeType[node.type] + "(" +
                "v=" + ((node.value === undefined) ? "0" : node.value.toString()) + "," +
                "do=" + ((node.dataOffset === undefined) ? "0" : node.dataOffset.toString()) + "," +
                "sc=" + ((node.systemCall === undefined) ? "?" : SystemCall[node.systemCall]) + ")";
        }
        AST.nodeToString = nodeToString;
        ;
        function cloneNode(node) {
            return {
                type: node.type,
                value: node.value,
                dataOffset: node.dataOffset,
                systemCall: node.systemCall,
                childScope: cloneNodes(node.childScope),
                location: node.location
            };
        }
        function cloneNodes(nodes) { return nodes === undefined ? undefined : nodes.map(function (node) { return cloneNode(node); }); }
        (function (ErrorSeverity) {
            ErrorSeverity[ErrorSeverity["Verbose"] = 0] = "Verbose";
            ErrorSeverity[ErrorSeverity["Info"] = 1] = "Info";
            ErrorSeverity[ErrorSeverity["Warning"] = 2] = "Warning";
            ErrorSeverity[ErrorSeverity["Error"] = 3] = "Error";
        })(AST.ErrorSeverity || (AST.ErrorSeverity = {}));
        var ErrorSeverity = AST.ErrorSeverity;
        function defaultOnError(error) {
            if (!!error.location)
                console.error("Error:", error.description, "@", error.location.file + "(" + error.location.line + ")");
            else
                console.error("Error:", error.description);
        }
        function parse(args) {
            // Preconditions
            console.assert(!!args, "parse: args is not optional");
            console.assert(args.code !== undefined, "parse: args.code is not optional");
            console.assert(args.code !== null, "parse: args.code is not optional");
            // Context
            var location = { file: "memory.bf", line: 1, column: 1 };
            var code = args.code;
            var _onError = args.onError || defaultOnError; // Prefer softError/fatalError
            var _root = []; // You probably want scope
            var _scopeStack = [_root]; // Prefer scope/pushScope/popScope
            var atLocation = function (tempLocation, action) { var origLocation = location; location = tempLocation; action(); location = origLocation; };
            // Utils
            var info = function (desc) { return _onError({ severity: ErrorSeverity.Info, description: desc, location: Debugger.cloneSourceLocation(location) }); };
            var warning = function (desc) { return _onError({ severity: ErrorSeverity.Warning, description: desc, location: Debugger.cloneSourceLocation(location) }); };
            var error = function (desc) { return _onError({ severity: ErrorSeverity.Error, description: desc, location: Debugger.cloneSourceLocation(location) }); };
            var scope = function () { return _scopeStack[_scopeStack.length - 1]; };
            var pushScope = function () { var scope = []; _scopeStack.push(scope); return scope; };
            var popScope = function () { if (_scopeStack.length == 1)
                error("Reached end of scope ']', but was already at the root scope!");
            else
                _scopeStack.pop(); };
            for (var codeI = 0; codeI < code.length; ++codeI) {
                var ch = code[codeI];
                switch (ch) {
                    case "<":
                        scope().push({ type: NodeType.AddDataPtr, value: -1, location: Debugger.cloneSourceLocation(location) });
                        break;
                    case ">":
                        scope().push({ type: NodeType.AddDataPtr, value: +1, location: Debugger.cloneSourceLocation(location) });
                        break;
                    case "+":
                        scope().push({ type: NodeType.AddData, value: +1, location: Debugger.cloneSourceLocation(location) });
                        break;
                    case "-":
                        scope().push({ type: NodeType.AddData, value: -1, location: Debugger.cloneSourceLocation(location) });
                        break;
                    case ",":
                        scope().push({ type: NodeType.SystemCall, systemCall: SystemCall.Getch, location: Debugger.cloneSourceLocation(location) });
                        break;
                    case ".":
                        scope().push({ type: NodeType.SystemCall, systemCall: SystemCall.Putch, location: Debugger.cloneSourceLocation(location) });
                        break;
                    case "[":
                        scope().push({ type: NodeType.Loop, childScope: pushScope(), location: Debugger.cloneSourceLocation(location) });
                        break;
                    case "]":
                        popScope();
                        break;
                    default: break;
                }
                //++location.byte;
                if (ch == "\n") {
                    ++location.line;
                    location.column = 1;
                }
                else {
                    ++location.column;
                }
            }
            scope().push({ type: NodeType.SystemCall, systemCall: SystemCall.TapeEnd, location: Debugger.cloneSourceLocation(location) });
            if (_scopeStack.length > 1) {
                for (var i = _scopeStack.length - 2; i >= 0; --i) {
                    var badScopeNode = _scopeStack[i][_scopeStack[i].length - 1];
                    atLocation(badScopeNode.location, function () { return error("Start of scope '[' not terminated before end of file!"); });
                }
                error("Unexpected end of file!");
                return undefined;
            }
            return { ast: _root, optimizedAst: AST.optimize({ ast: cloneNodes(_root), onError: args.onError }) };
        }
        AST.parse = parse;
    })(AST = Brainfuck.AST || (Brainfuck.AST = {}));
})(Brainfuck || (Brainfuck = {}));
var Brainfuck;
(function (Brainfuck) {
    var AST;
    (function (AST) {
        // Optimize [..., a, ...]
        function singleOptimizations(args) {
            var changes = false;
            var ast = args.ast;
            for (var i = 0; i <= ast.length - 1; ++i) {
                var a = ast[i + 0];
                var replace = function () {
                    var nodes = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        nodes[_i - 0] = arguments[_i];
                    }
                    ast.splice.apply(ast, [i, 1].concat(nodes));
                    --i;
                    changes = true;
                };
                // Single-op loop optimizations
                if (a.type === AST.NodeType.Loop) {
                    if (a.childScope.length === 0) {
                        replace({ type: AST.NodeType.BreakIf, location: a.location });
                    }
                    else if (a.childScope.length === 1) {
                        var c = a.childScope[0];
                        switch (c.type) {
                            case AST.NodeType.AddData:
                                if (!!c.dataOffset)
                                    break;
                                if ((c.value & 1) === 0)
                                    args.onError({ description: "Infinite loop if *data is even, *data = 0 otherwise.  If you just want to set *data = 0, prefer [-] or [+]", location: c.location, severity: AST.ErrorSeverity.Warning });
                                replace({ type: AST.NodeType.SetData, value: 0, location: a.location });
                                break;
                            case AST.NodeType.SetData:
                                if (!!c.dataOffset)
                                    break;
                                if (c.value !== 0)
                                    args.onError({ description: "Infinite loop if *data != 0 - prefer [] if intentional", location: c.location, severity: AST.ErrorSeverity.Warning });
                                replace({ type: AST.NodeType.SetData, value: 0, location: a.location });
                                changes = true;
                                break;
                        }
                    }
                }
            }
            return changes;
        }
        // Optimize [..., a, b, ...]
        function pairOptimizations(args) {
            var changes = false;
            var ast = args.ast;
            for (var i = 0; i <= ast.length - 2; ++i) {
                var a = ast[i + 0];
                var b = ast[i + 1];
                var replace = function () {
                    var nodes = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        nodes[_i - 0] = arguments[_i];
                    }
                    ast.splice.apply(ast, [i, 2].concat(nodes));
                    --i;
                    changes = true;
                };
                // Collasing optimizations
                if (a.type === b.type) {
                    switch (a.type) {
                        case AST.NodeType.AddDataPtr:
                            a.value = (a.value + b.value);
                            replace(a);
                            break;
                        case AST.NodeType.AddData:
                            if ((a.dataOffset || 0) !== (b.dataOffset || 0))
                                break;
                            a.value = (a.value + b.value + 256) % 256;
                            replace(a);
                            break;
                    }
                }
                else {
                    // Optimize set + add into a plain set
                    if (a.type == AST.NodeType.SetData && b.type == AST.NodeType.AddData && (a.dataOffset || 0) === (b.dataOffset || 0)) {
                        a.value = (a.value + b.value);
                        replace(a);
                    }
                }
            }
            return changes;
        }
        // Optimize [..., a, b, c, ...]
        function triOptimizations(args) {
            var changes = false;
            var ast = args.ast;
            for (var i = 0; i <= ast.length - 3; ++i) {
                var a = ast[i + 0];
                var b = ast[i + 1];
                var c = ast[i + 2];
                var replace = function () {
                    var nodes = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        nodes[_i - 0] = arguments[_i];
                    }
                    ast.splice.apply(ast, [i, 3].concat(nodes));
                    --i;
                    changes = true;
                };
                // Offset optimizations
                if (a.type === AST.NodeType.AddDataPtr && c.type === AST.NodeType.AddDataPtr && a.value === -c.value) {
                    switch (b.type) {
                        // e.g. <[-]> or >[+]< or >>>[+]<<< or ...
                        case AST.NodeType.SetData:
                            replace({
                                type: AST.NodeType.SetData,
                                location: a.location,
                                dataOffset: a.value + (b.dataOffset || 0),
                                value: b.value
                            });
                            break;
                        // e.g. <-----> or >++++<
                        case AST.NodeType.AddData:
                            replace({
                                type: AST.NodeType.AddData,
                                location: a.location,
                                dataOffset: a.value + (b.dataOffset || 0),
                                value: b.value
                            });
                            break;
                    }
                }
            }
            return changes;
        }
        function optimize(args) {
            args.ast.forEach(function (node) { if (node.childScope)
                node.childScope = optimize({ ast: node.childScope, onError: args.onError }); });
            //let optimizations = [];
            //let optimizations = [pairOptimizations, singleOptimizations];
            var optimizations = [pairOptimizations, singleOptimizations, triOptimizations];
            for (var optimizeAttempt = 0; optimizeAttempt < 100; ++optimizeAttempt) {
                if (!optimizations.some(function (o) { return o(args); }))
                    break; // Optimizations done
            }
            return args.ast;
        }
        AST.optimize = optimize;
    })(AST = Brainfuck.AST || (Brainfuck.AST = {}));
})(Brainfuck || (Brainfuck = {}));
var Brainfuck;
(function (Brainfuck) {
    var VmCompiler;
    (function (VmCompiler) {
        function createDebugger(code, stdout) {
            var errors = false;
            var parseResult = Brainfuck.AST.parse({ code: code, onError: function (e) { if (e.severity == Brainfuck.AST.ErrorSeverity.Error)
                    errors = true; } });
            if (errors)
                return undefined;
            var program = VmCompiler.compileProgram(parseResult.optimizedAst);
            var vm = {
                code: program,
                data: [],
                codePtr: 0,
                dataPtr: 0,
                sysCalls: [],
                insRan: 0,
                runTime: 0,
                wallStart: Date.now(),
            };
            var runHandle = undefined;
            var doPause = function () { if (runHandle !== undefined)
                clearInterval(runHandle); runHandle = undefined; };
            var doContinue = function () { if (runHandle === undefined)
                runHandle = setInterval(function () { return VmCompiler.runSome(vm, 100000); }, 0); }; // Increase instruction limit after fixing loop perf?
            var doStop = function () { doPause(); vm.dataPtr = vm.data.length; };
            var doStep = function () { return VmCompiler.runOne(vm); };
            var getMemory = function (start, size) { return vm.data.slice(start, start + size); };
            var getState = function () {
                return vm === undefined ? Debugger.State.Detatched
                    : vm.codePtr >= vm.code.locs.length ? Debugger.State.Done
                        : runHandle !== undefined ? Debugger.State.Running
                            : Debugger.State.Paused;
            };
            vm.sysCalls[Brainfuck.AST.SystemCall.Putch] = function (vm) { return stdout(String.fromCharCode(vm.data[vm.dataPtr])); };
            vm.sysCalls[Brainfuck.AST.SystemCall.TapeEnd] = function (vm) { return doStop(); };
            return {
                symbols: VmCompiler.createSymbolLookup(program),
                state: getState,
                threads: function () { return VmCompiler.getThreads(vm, code); },
                memory: getMemory,
                pause: doPause,
                continue: doContinue,
                stop: doStop,
                step: doStep,
            };
        }
        VmCompiler.createDebugger = createDebugger;
    })(VmCompiler = Brainfuck.VmCompiler || (Brainfuck.VmCompiler = {}));
})(Brainfuck || (Brainfuck = {}));
var Debugger;
(function (Debugger) {
    (function (State) {
        State[State["Detatched"] = 0] = "Detatched";
        State[State["Paused"] = 1] = "Paused";
        State[State["Running"] = 2] = "Running";
        State[State["Done"] = 3] = "Done";
    })(Debugger.State || (Debugger.State = {}));
    var State = Debugger.State;
    function cloneSourceLocation(sl) { return { file: sl.file, line: sl.line, column: sl.column }; }
    Debugger.cloneSourceLocation = cloneSourceLocation;
    function sourceLocationEqualColumn(a, b) { return a.file === b.file && a.line === b.line && a.column === b.column; }
    Debugger.sourceLocationEqualColumn = sourceLocationEqualColumn;
    function sourceLocationEqualLine(a, b) { return a.file === b.file && a.line === b.line; }
    Debugger.sourceLocationEqualLine = sourceLocationEqualLine;
    function sourceLocationEqualFile(a, b) { return a.file === b.file; }
    Debugger.sourceLocationEqualFile = sourceLocationEqualFile;
})(Debugger || (Debugger = {}));
var UI;
(function (UI) {
    var Debug;
    (function (Debug) {
        Debug.prevState = undefined;
        function setDebugState(state) {
            if (Debug.prevState == state)
                return;
            ITC.sendTo("mmide-debug-state", { newState: state });
            Debug.prevState = state;
        }
        Debug.setDebugState = setDebugState;
        function toggleClassVisibility(class_, visible) {
            UI.byClassName(class_).forEach(function (e) { return e.style.display = visible ? "" : "none"; });
        }
        addEventListener("load", function (loadEvent) {
            ITC.listenTo("mmide-debug-state", function (dsc) {
                var styles = "debug-state-detatched debug-state-done debug-state-running debug-state-paused".split(' ');
                var visibleStyle = "";
                switch (dsc.newState) {
                    case Debugger.State.Detatched:
                        visibleStyle = "debug-state-detatched";
                        break;
                    case Debugger.State.Done:
                        visibleStyle = "debug-state-done";
                        break;
                    case Debugger.State.Running:
                        visibleStyle = "debug-state-running";
                        break;
                    case Debugger.State.Paused:
                        visibleStyle = "debug-state-paused";
                        break;
                }
                //console.log("state :=",visibleStyle);
                //console.assert(styles.indexOf(visibleStyle) !== -1);
                styles.forEach(function (style) { if (style !== visibleStyle)
                    toggleClassVisibility(style, false); });
                toggleClassVisibility(visibleStyle, true);
            });
        });
    })(Debug = UI.Debug || (UI.Debug = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Debug;
    (function (Debug) {
        var theDebugger = undefined;
        function Start(paused) {
            UI.Output.stdio().clear();
            var script = UI.Editor.getScript();
            //theDebugger = Brainfuck.Eval.createDebugger(script, (stdout) => {
            //theDebugger = Brainfuck.VmCompiler.createDebugger(script, (stdout) => {
            theDebugger = Brainfuck.VmCompiler.createAsyncDebugger(script, function (stdout) {
                UI.Output.stdio().write(stdout);
            });
            if (!paused)
                theDebugger.continue();
            Debug.setDebugState(theDebugger.state());
        }
        Debug.Start = Start;
        function Stop() {
            theDebugger.stop();
            theDebugger = undefined;
            Debug.setDebugState(Debugger.State.Detatched);
        }
        Debug.Stop = Stop;
        function Continue() {
            theDebugger.continue();
            Debug.setDebugState(theDebugger.state());
        }
        Debug.Continue = Continue;
        function Step() {
            theDebugger.step();
        }
        Debug.Step = Step;
        function Pause() {
            theDebugger.pause();
            Debug.setDebugState(theDebugger.state());
        }
        Debug.Pause = Pause;
        function Restart(paused) {
            if (theDebugger !== undefined)
                Stop();
            Start(paused);
        }
        Debug.Restart = Restart;
        addEventListener("load", function (e) {
            if (!UI.Editor.isAvailable())
                return; // We're not the "Main" tab, don't drive debug state
            if (Debug.prevState === undefined)
                Debug.setDebugState(Debugger.State.Detatched);
            setInterval(function () {
                var thread = theDebugger === undefined ? undefined : theDebugger.threads()[0];
                var address = thread === undefined ? undefined : thread.currentPos();
                var sourceLoc = theDebugger === undefined || theDebugger.symbols === undefined ? undefined : theDebugger.symbols.addrToSourceLocation(address);
                Debug.setDebugState(theDebugger === undefined ? Debugger.State.Detatched : theDebugger.state());
                UI.Registers.update(theDebugger);
                UI.Memory.update(theDebugger);
                UI.Editor.setCurrentPosition(sourceLoc === undefined ? -1 : sourceLoc.line, sourceLoc === undefined ? -1 : sourceLoc.column);
            }, 10);
        });
    })(Debug = UI.Debug || (UI.Debug = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Editor;
    (function (Editor) {
        var _editor = undefined;
        function editor() {
            if (_editor === undefined) {
                if (!UI.byId("editor") || !window["ace"]) {
                    _editor = null;
                    return;
                }
                _editor = ace.edit("editor");
                _editor.setTheme("ace/theme/monokai");
                var session = _editor.getSession();
                //session.setMode("ace/mode/javascript");
                session.setTabSize(4);
                session.setUseSoftTabs(false);
            }
            return _editor;
        }
        function isAvailable() {
            return !!editor();
        }
        Editor.isAvailable = isAvailable;
        function getScript() {
            var e = editor();
            return e ? e.getValue() : "";
        }
        Editor.getScript = getScript;
        function setScript(script) {
            var e = editor();
            if (e)
                e.setValue(script);
        }
        Editor.setScript = setScript;
        function setTheme(theme) {
            var e = editor();
            if (e)
                e.setTheme("ace/theme/" + theme.toLowerCase().replace(' ', '_'));
        }
        Editor.setTheme = setTheme;
        function errorToAnnotation(error) {
            var errorType = "error";
            switch (error.severity) {
                case Brainfuck.AST.ErrorSeverity.Verbose:
                    errorType = "info";
                    break;
                case Brainfuck.AST.ErrorSeverity.Info:
                    errorType = "info";
                    break;
                case Brainfuck.AST.ErrorSeverity.Warning:
                    errorType = "warning";
                    break;
                case Brainfuck.AST.ErrorSeverity.Error:
                    errorType = "error";
                    break;
            }
            var a = {
                row: error.location.line - 1,
                column: error.location.column - 1,
                text: error.description,
                type: errorType,
            };
            return a;
        }
        function setErrors(errors) {
            var e = editor();
            if (!e)
                return;
            var s = e.getSession();
            var lineErrors = [];
            errors.forEach(function (error) {
                if (!error.location || !error.location.line)
                    return;
                var le = lineErrors[error.location.line];
                if (le === undefined)
                    le = lineErrors[error.location.line] = [];
                le.push(error);
            });
            s.setAnnotations(errors.map(errorToAnnotation).filter(function (a) { return !!a; }));
        }
        Editor.setErrors = setErrors;
        var currentMarker = undefined;
        var currentLine = -1;
        var currentCol = -1;
        //let Range = ace.require("ace/Range").Range;
        function setCurrentPosition(line, col) {
            if (col === void 0) { col = -1; }
            var e = editor();
            if (!e)
                return;
            var s = e.getSession();
            if (currentLine != line) {
                s.removeGutterDecoration(currentLine, "current-line");
                currentLine = line - 1;
                s.addGutterDecoration(currentLine, "current-line");
            }
            if (currentCol != col) {
                currentCol = col;
                if (currentMarker !== undefined)
                    s.removeMarker(currentMarker);
                if (col != -1) {
                    //let range = <ace.Range>new (<any>Range)(line-1, col-1, line-1, col-0);
                    //let range = new ace.Range(line-1, col-1, line-1, col-0);
                    var range = s.getAWordRange(line - 1, col - 1);
                    range.start.column = col - 1;
                    range.end.column = col - 0;
                    currentMarker = s.addMarker(range, "current-column", "text", false);
                }
                else {
                    currentMarker = undefined;
                }
            }
        }
        Editor.setCurrentPosition = setCurrentPosition;
        addEventListener("load", function (ev) {
            var ed = editor();
            if (!ed)
                return;
            // "Ace only resizes itself on window events. If you resize the editor div in another manner, and need Ace to resize, use the following"
            // Currently, console output, memory dump resizes, etc. may alter the editor div size.
            // Takes maybe ~5ms/check from an initial look at Chrome timeline results?  Not nearly my biggest perf issue atm.
            setInterval(function () { ed.resize(false); }, 100);
            var errors = [];
            var lastScript = "";
            setInterval(function () {
                var newScript = getScript();
                if (newScript == lastScript)
                    return;
                lastScript = newScript;
                errors = [];
                Brainfuck.AST.parse({
                    code: newScript,
                    onError: function (e) { return errors.push(e); },
                });
                setErrors(errors);
            }, 100);
        });
    })(Editor = UI.Editor || (UI.Editor = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Memory;
    (function (Memory) {
        function collectTableCells(config, memoryBaseAddress, memory) {
            var table = [];
            for (var rowI = 0; rowI < config.rows; ++rowI) {
                var row = [];
                if (config.showAddress)
                    appendAddressCell(row, config, rowI, memoryBaseAddress);
                if (config.showHex)
                    appendHexCells(row, config, rowI, memory);
                if (config.showData)
                    appendDataCells(row, config, rowI, memory);
                table.push(row);
            }
            return table;
        }
        Memory.collectTableCells = collectTableCells;
        function appendAddressCell(rowCells, config, rowI, memoryBaseAddress) {
            if (config.showAddress) {
                var a = (memoryBaseAddress + config.colSize * config.cols * rowI).toString(16);
                var pad = "0x00000000";
                rowCells.push({ type: "memory-cell-address", display: pad.substr(0, pad.length - a.length) + a, data: a });
            }
        }
        function appendHexCells(rowCells, config, rowI, memory) {
            for (var colI = 0; colI < config.cols; ++colI) {
                var cellText = "";
                for (var byteI = 0; byteI < config.colSize; ++byteI) {
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
            for (var colI = 0; colI < config.cols; ++colI) {
                var offset = config.colSize * (colI + (config.cols * rowI));
                for (var byteI = 0; byteI < config.colSize; ++byteI) {
                    var v = getByte(memory, config, rowI, colI, byteI, false);
                    var cellText = (32 <= v && v < 127) ? String.fromCharCode(v) : "."; // XXX: Abuse unicode? 127 = DEL, probably bad.
                    var cellData = String.fromCharCode(v);
                    rowCells.push({ type: "memory-cell-data", display: cellText, data: cellData });
                }
            }
        }
        function getByte(memory, config, rowI, colI, byteI, littleEndian) {
            // NOTE WELL: We now assume "memory" comes to us pre-sliced such that memory[0] ~ config.baseAddress (or more accurately, memoryBaseAddress and we lag behind maybe)
            // We could try starting at config.baseAddress - lastUpdateMemoryBaseAddress or some shit but how about no.
            return memory[(littleEndian ? config.colSize - byteI - 1 : byteI) + config.colSize * (colI + config.cols * rowI)] || 0;
        }
    })(Memory = UI.Memory || (UI.Memory = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Memory;
    (function (Memory) {
        // Slow on IE (~130-220ms without animation, 190-250ms with full duration animation)
        function doUpdateTableD3(memoryElement, config, rows) {
            var d3table = d3.select(memoryElement).select("table");
            if (d3table.empty()) {
                memoryElement.innerText = ""; // Clear possible previous text nodes
                d3table = d3.select(memoryElement).append("table").style("border-collapse", "collapse");
            }
            var d3rows = d3table.selectAll("tr").data(rows);
            d3rows.enter().append("tr");
            d3rows.exit().remove();
            d3rows.each(function (row) {
                var rowElement = this;
                var d3cells = d3.select(rowElement).selectAll("td").data(row);
                d3cells.exit().remove();
                var d3NewCells = d3cells.enter().append("td");
                //d3NewCells.style("position","absolute").style("left","0").style("top","0").style("width","2em").style("height","2em"); // Test to see if this helps perf - it doesn't
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
        // Slow on IE (~130-210ms), not much faster than doUpdateTableD3
        function doUpdateTableD3Hybrid(memoryElement, config, rows) {
            var d3table = d3.select(memoryElement).select("table");
            if (d3table.empty()) {
                memoryElement.innerText = ""; // Clear possible previous text nodes
                d3table = d3.select(memoryElement).append("table").style("border-collapse", "collapse");
            }
            var d3rows = d3table.selectAll("tr").data(rows);
            d3rows.enter().append("tr");
            d3rows.exit().remove();
            d3rows.each(function (row) {
                var rowElement = this;
                var d3cells = d3.select(rowElement).selectAll("td").data(row);
                d3cells.exit().remove();
                d3cells.enter().append("td");
                d3cells.each(function (cell) {
                    var cellElement = this;
                    cellElement.textContent = cell.display;
                });
            });
            d3rows.order();
        }
        var htmlEntityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };
        function escapeHtml(text) { return String(text).replace(/[&<>"'`=\/]/g, function (fragment) { return htmlEntityMap[fragment]; }); }
        // Faster than doUpdateTableD3 et all (~30±5 ms on IE) but could be faster
        function doUpdateTableHtml(memoryElement, config, rows) {
            var html = "";
            html += "<table style=\"border-collapse: collapse\">\n";
            rows.forEach(function (row) {
                html += "\t<tr>";
                row.forEach(function (cell) {
                    html += "<td>";
                    html += escapeHtml(cell.display);
                    html += "</td>";
                });
                html += "</tr>\n";
            });
            memoryElement.innerHTML = html;
        }
        // Sufficiently fast on IE (~15ms±3 ms on IE)
        var prevRows = [];
        function updateCellChanged(col, row, value) {
            var prevRow = prevRows[row] = prevRows[row] || [];
            var changed = prevRow[col] !== value;
            prevRow[col] = value;
            return changed;
        }
        function doUpdateTableCanvas(memoryElement, config, rows) {
            var d3canvas = d3.select(memoryElement).select("canvas");
            if (d3canvas.empty()) {
                memoryElement.innerText = ""; // Clear possible previous text nodes
                d3canvas = d3.select(memoryElement).append("canvas");
            }
            var font = "8pt Consolas, Courier New, Courier, monospace";
            //let font = "8pt Consolas"
            var canvas = d3canvas[0][0];
            var context = canvas.getContext("2d");
            context.font = font;
            // Layout
            var colWidths = [];
            //let rowHeights = []; // XXX: measureText().width is all we can rely on for now
            rows.forEach(function (row, rowI) {
                row.forEach(function (cell, cellI) {
                    var m = context.measureText(cell.display);
                    colWidths[cellI] = Math.max((colWidths[cellI] || 0), m.width);
                });
            });
            var totalWidth = 0;
            colWidths.forEach(function (w) { return totalWidth += w; });
            //let rowHeight = 16; // Arbitrary
            var rowHeight = 13; // Arbitrary
            var totalHeight = rows.length * rowHeight - 3;
            // DOM Layout
            canvas.width = canvas.clientWidth = totalWidth;
            canvas.height = canvas.clientHeight = totalHeight;
            context = canvas.getContext("2d"); // XXX: Not sure if this is necessary
            context.font = font;
            // Render
            context.fillStyle = 'rgba(0,0,0,0.0)';
            context.clearRect(0, 0, canvas.width, canvas.height);
            var y = 0;
            rows.forEach(function (row, rowI) {
                //let rowHeight = rowHeight;
                var x = 0;
                row.forEach(function (cell, cellI) {
                    var colWidth = colWidths[cellI];
                    if (updateCellChanged(cellI, rowI, cell.data)) {
                        context.fillStyle = '#F66';
                        context.fillRect(x, y - 1, colWidth, rowHeight);
                    }
                    context.fillStyle = '#000';
                    context.fillText(cell.display, x, y + rowHeight - 3, colWidth);
                    x += colWidth;
                });
                y += rowHeight;
            });
        }
        // Fucking fast (~1±1ms on IE)
        function doUpdateTableText(memoryElement, config, rows) {
            var text = "";
            rows.forEach(function (row) {
                row.forEach(function (cell) {
                    text += cell.display;
                });
                text += "\n";
            });
            memoryElement.innerText = text;
        }
        var updateD3TooSlowThreshhold = 30; // ms
        var updateD3TooSlow = false;
        function doUpdateTableSmart(memoryElement, config, rows) {
            if (!updateD3TooSlow) {
                var s = Date.now();
                doUpdateTableD3(memoryElement, config, rows);
                var e = Date.now() - s;
                if (e >= updateD3TooSlowThreshhold && !updateD3TooSlow) {
                    console.warn("doUpdateTableD3 took too long (" + e + "ms >= " + updateD3TooSlowThreshhold + "ms) to execute, falling back on doUpdateTableText & doUpdateTableCanvas");
                    updateD3TooSlow = true;
                }
            }
            else if (config.dataChangedDisplay) {
                doUpdateTableCanvas(memoryElement, config, rows);
            }
            else {
                doUpdateTableText(memoryElement, config, rows);
            }
        }
        //export const updateTable = debounce(measure(doUpdateTableSmart, "updateTable"), 10);
        Memory.updateTable = debounce(doUpdateTableSmart, 10);
        function applyDataChangedTransition(config, d3cell) {
            var transitionId = "highlight-changed";
            d3cell.interrupt(transitionId);
            d3cell.style("background-color", "#F44");
            switch (config.dataChangedDisplay) {
                case Memory.DataChangedDisplay.DelayHighlight:
                    d3cell
                        .transition(transitionId).delay(30).duration(0).style("background-color", "#FAA")
                        .transition().delay(30).duration(0).style("background-color", "#ECC")
                        .transition().delay(30).duration(0).style("background-color", undefined);
                    break;
                case Memory.DataChangedDisplay.DurationHighlight:
                    d3cell
                        .transition(transitionId).duration(100).style("background-color", "#FAA")
                        .transition().duration(100).style("background-color", "#DDD")
                        .transition().style("background-color", undefined);
                    break;
            }
        }
    })(Memory = UI.Memory || (UI.Memory = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Memory;
    (function (Memory) {
        (function (DataChangedDisplay) {
            DataChangedDisplay[DataChangedDisplay["None"] = 0] = "None";
            DataChangedDisplay[DataChangedDisplay["DelayHighlight"] = 1] = "DelayHighlight";
            DataChangedDisplay[DataChangedDisplay["DurationHighlight"] = 2] = "DurationHighlight";
        })(Memory.DataChangedDisplay || (Memory.DataChangedDisplay = {}));
        var DataChangedDisplay = Memory.DataChangedDisplay;
        function isDataChangedDisplayOK() {
            // Chrome (FAST):	navigator.userAgent == "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
            // IE 11 (SLOW):	navigator.userAgent == "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko"
            return true;
        }
        Memory.isDataChangedDisplayOK = isDataChangedDisplayOK;
        function getMemoryViewConfig(el) {
            var bool = function (k) { var value = el.dataset[k]; console.assert(value !== undefined && value !== null); return value === "1" || value === "true"; };
            var string = function (k) { var value = el.dataset[k]; console.assert(value !== undefined && value !== null); return value; };
            var int = function (k) { var value = parseInt(el.dataset[k]); console.assert(value !== undefined && value !== null && !isNaN(value) && isFinite(value)); return value; };
            return {
                baseAddress: int("address"),
                colSize: int("colSize"),
                cols: int("cols"),
                rows: int("rows"),
                showLittleEndian: bool("littleEndian"),
                showAddress: bool("showAddress"),
                showHex: bool("showHex"),
                showData: bool("showData"),
                forceChangedDisplay: bool("forceChangedDisplay"),
                dataChangedDisplay: DataChangedDisplay[string("changedDisplay")],
            };
        }
        Memory.getMemoryViewConfig = getMemoryViewConfig;
    })(Memory = UI.Memory || (UI.Memory = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Memory;
    (function (Memory) {
        var updatePrefix = "mmide-memory-update-";
        var listenerPrefix = "mmide-memory-listener-";
        function getListeners() { return ITC.peekAll(listenerPrefix); }
        function getUpdates() { return ITC.peekAll(updatePrefix); }
        // Local update of memory
        function update(localDebugger) {
            if (!localDebugger)
                return;
            getUpdates(); // Just clear old responses
            getListeners().forEach(function (req) {
                var response = {
                    baseAddress: req.baseAddress,
                    data: localDebugger.memory(req.baseAddress, req.size),
                };
                ITC.sendTo(req.responseKey, response);
            });
        }
        Memory.update = update;
        // Ensure we recieve remote updates of memory
        function sendUpdateRequest() {
            ITC.sendToByClassName("memory", listenerPrefix, function (args) {
                var config = Memory.getMemoryViewConfig(args.element);
                var listenNotice = {
                    baseAddress: config.baseAddress,
                    size: config.cols * config.rows * config.colSize,
                    responseKey: updatePrefix + args.itcKey,
                };
                return listenNotice;
            });
        }
        addEventListener("load", function (ev) {
            // Remote update of memory
            ITC.listenToByClassName("memory", updatePrefix, function (ev) {
                var config = Memory.getMemoryViewConfig(ev.element);
                var table = Memory.collectTableCells(config, ev.header.baseAddress, ev.header.data);
                Memory.updateTable(ev.element, config, table);
            });
            sendUpdateRequest();
            setInterval(sendUpdateRequest, 1000); // Keepalive
        });
    })(Memory = UI.Memory || (UI.Memory = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Output;
    (function (Output) {
        var maxCol = 180;
        var NamedOutput = (function () {
            function NamedOutput(postfix) {
                var className = this.className = "output-" + postfix;
                var itcKey = this.itcKey = "mmide-output-" + postfix;
                this.col = 0;
                this.buffer = "";
                this.lineBuffer = "";
                this.dirty = false;
                this.animated = false;
                ITC.listenTo(itcKey, function (ev) { return UI.byClassName(className).forEach(function (el) {
                    //let s = Date.now();
                    el.textContent = ev.buffer;
                    //console.log(Date.now()-s,"ms to update output");
                }); });
            }
            NamedOutput.prototype.doSend = function () {
                var nextEol = this.lineBuffer.indexOf("\n");
                while (nextEol != -1) {
                    while (nextEol > maxCol) {
                        this.buffer += this.lineBuffer.substr(0, maxCol) + "\n";
                        this.lineBuffer = this.lineBuffer.substr(maxCol);
                        nextEol -= maxCol;
                    }
                    this.buffer += this.lineBuffer.substr(0, nextEol) + "\n";
                    this.lineBuffer = this.lineBuffer.substr(nextEol + 1);
                    nextEol = this.lineBuffer.indexOf("\n");
                }
                while (this.lineBuffer.length > maxCol) {
                    this.buffer += this.lineBuffer.substr(0, maxCol) + "\n";
                    this.lineBuffer = this.lineBuffer.substr(maxCol);
                }
                ITC.sendTo(this.itcKey, { buffer: this.buffer + this.lineBuffer });
            };
            NamedOutput.prototype.perFrame = function () {
                var _this = this;
                requestAnimationFrame(function () { return _this.perFrame(); });
                if (this.dirty)
                    this.doSend();
                this.dirty = false;
            };
            NamedOutput.prototype.kickoffSend = function () {
                var _this = this;
                this.dirty = true;
                if (this.animated)
                    return;
                this.animated = true;
                requestAnimationFrame(function () { return _this.perFrame(); });
                setInterval(function () { return _this.kickoffSend(); }, 1000);
            };
            NamedOutput.prototype.clear = function () {
                this.buffer = this.lineBuffer = "";
                this.kickoffSend();
            };
            NamedOutput.prototype.write = function (data) {
                if (this.buffer.length + this.lineBuffer.length >= 1000000)
                    return;
                this.lineBuffer += data;
                this.kickoffSend();
            };
            return NamedOutput;
        })();
        Output.NamedOutput = NamedOutput;
        function lazyishNamedOutput(id) {
            var no = undefined;
            var callback = function () { if (!no)
                no = new NamedOutput(id); return no; };
            addEventListener("load", callback);
            return callback;
        }
        Output.stdio = lazyishNamedOutput("stdio");
    })(Output = UI.Output || (UI.Output = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Registers;
    (function (Registers) {
        //const log = (m,...a) => console.log(m,...a);
        var log = function (m) {
            var a = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                a[_i - 1] = arguments[_i];
            }
        };
        function update(localDebugger) {
            if (!localDebugger)
                return;
            var registers = localDebugger.threads()[0].registers();
            if (!registers)
                return;
            var msg = { registers: registers };
            log("Sending registers...");
            ITC.sendTo("mmide-registers", msg);
        }
        Registers.update = update;
        addEventListener("load", function (loadEvent) { return ITC.listenTo("mmide-registers", function (update) {
            log("Recieving registers...");
            var els = UI.byClassName("registers");
            if (!els)
                return;
            log("Elements to update...");
            var registers = update.registers;
            var flat = "";
            var lpad = "";
            var rpad = "                 ";
            registers.forEach(function (reg) {
                if (!reg[1])
                    flat += reg[0] + "\n";
                else
                    flat += reg[0] + lpad.substring(reg[0].length) + " := " + rpad.substring(reg[1].length) + reg[1] + "\n";
            });
            flat = flat.substr(0, flat.length - 1);
            els.forEach(function (el) { return el.textContent = flat; });
        }); });
    })(Registers = UI.Registers || (UI.Registers = {}));
})(UI || (UI = {}));
var _ui_document = this["document"];
var UI;
(function (UI) {
    function byClassName(className) {
        if (!_ui_document)
            return []; // Webworker context
        var e = [];
        var els = document.getElementsByClassName(className);
        for (var i = 0; i < els.length; ++i)
            e.push(els.item(i));
        return e;
    }
    UI.byClassName = byClassName;
    function byId(elementId) {
        if (!_ui_document)
            return null; // Webworker context
        var e = document.getElementById(elementId);
        return e;
    }
    UI.byId = byId;
})(UI || (UI = {}));
function measure(callback, label) {
    var wrapped = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var s = Date.now();
        var r = callback.call.apply(callback, [this].concat(args));
        var e = Date.now() - s;
        console.log(label, "took", e, "ms");
        return r;
    };
    return wrapped;
}
//# sourceMappingURL=mmide.js.map