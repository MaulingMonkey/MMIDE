var Examples;
(function (Examples) {
    function LoadExample(example) {
        UI.Editor.setScript(example);
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
        function cloneSourceLocation(sl) { return { file: sl.file, line: sl.line, column: sl.column }; }
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
            var info = function (desc) { return _onError({ severity: ErrorSeverity.Info, description: desc, location: cloneSourceLocation(location) }); };
            var warning = function (desc) { return _onError({ severity: ErrorSeverity.Warning, description: desc, location: cloneSourceLocation(location) }); };
            var error = function (desc) { return _onError({ severity: ErrorSeverity.Error, description: desc, location: cloneSourceLocation(location) }); };
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
                        scope().push({ type: NodeType.AddDataPtr, value: -1, location: cloneSourceLocation(location) });
                        break;
                    case ">":
                        scope().push({ type: NodeType.AddDataPtr, value: +1, location: cloneSourceLocation(location) });
                        break;
                    case "+":
                        scope().push({ type: NodeType.AddData, value: +1, location: cloneSourceLocation(location) });
                        break;
                    case "-":
                        scope().push({ type: NodeType.AddData, value: -1, location: cloneSourceLocation(location) });
                        break;
                    case ",":
                        scope().push({ type: NodeType.SystemCall, systemCall: SystemCall.Getch, location: cloneSourceLocation(location) });
                        break;
                    case ".":
                        scope().push({ type: NodeType.SystemCall, systemCall: SystemCall.Putch, location: cloneSourceLocation(location) });
                        break;
                    case "[":
                        scope().push({ type: NodeType.Loop, childScope: pushScope(), location: cloneSourceLocation(location) });
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
            scope().push({ type: NodeType.SystemCall, systemCall: SystemCall.TapeEnd, location: cloneSourceLocation(location) });
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
    var JsCompiler;
    (function (JsCompiler) {
        function toJsNumber(n) {
            var s = n.toString();
            if (!/^(([0-9]+)|([0-9]+)\.([0-9]+))$/.exec(s))
                return "0";
            return s;
        }
        console.assert(toJsNumber("") == "0");
        console.assert(toJsNumber("0") == "0");
        console.assert(toJsNumber("123") == "123");
        console.assert(toJsNumber("a") == "0");
        console.assert(toJsNumber(".") == "0");
        function toJsLocString(l) {
            var s = l.file + "(" + l.line + ")";
            if (!/^[0-9a-zA-Z_.]+$/.exec(s))
                return "\"unavailable\"";
            return "\"" + s + "\"";
        }
        //console.assert(toJsLocString({ file: "a", line: 1, column: 1 }) == "\"a(1)\"");
        //console.assert(toJsLocString({ file: "0", line: 1, column: 1 }) == "\"0(1)\"");
        console.assert(toJsLocString({ file: "!", line: 1, column: 1 }) == "\"unavailable\"");
        function compileTo(js, ast, args) {
            for (var astI = 0; astI < ast.length; ++astI) {
                var op = ast[astI];
                if (args.debug) {
                    js.push("location = " + toJsLocString(op.location) + ";");
                }
                switch (op.type) {
                    case Brainfuck.AST.NodeType.AddDataPtr:
                        js.push("dataPtr += " + op.value + ";");
                        break;
                    case Brainfuck.AST.NodeType.AddData:
                        js.push("data[dataPtr + (" + op.dataOffset + ")] += (" + op.value + " + 256) % 256;");
                        break;
                    case Brainfuck.AST.NodeType.SetData:
                        js.push("data[dataPtr + (" + op.dataOffset + ")]  = (" + op.value + " + 256) % 256;");
                        break;
                    case Brainfuck.AST.NodeType.SystemCall:
                        js.push(args.systemCalls[op.systemCall]);
                        break;
                    case Brainfuck.AST.NodeType.BreakIf:
                        js.push("if (data[dataPtr]) {");
                        js.push(args.systemCalls[Brainfuck.AST.SystemCall.Break]);
                        js.push("}");
                        break;
                    case Brainfuck.AST.NodeType.Loop:
                        js.push("while (data[dataPtr]) {");
                        compileTo(js, op.childScope, args);
                        js.push("}");
                        break;
                    default: return false;
                }
            }
            return true;
        }
        function compile(ast, args) {
            var js = [];
            js.push("(function () {");
            js.push("\"use strict\";");
            if (args.debug)
                js.push("var location = \"unavailable\";");
            js.push("var data = [];");
            js.push("var dataPtr = 0;");
            compileTo(js, ast, args);
            js.push("})();");
        }
        JsCompiler.compile = compile;
    })(JsCompiler = Brainfuck.JsCompiler || (Brainfuck.JsCompiler = {}));
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
        function vmOpTypeToString(type) { return VmOpType[type]; }
        VmCompiler.vmOpTypeToString = vmOpTypeToString;
        function vmOpToString(op) {
            return !op ? "??" : vmOpTypeToString(op.type) +
                (op.value ? (" (" + op.value + ")") : "") +
                (op.dataOffset ? ("@ " + op.dataOffset) : "");
        }
        VmCompiler.vmOpToString = vmOpToString;
        function compile(program, ast) {
            for (var astI = 0; astI < ast.length; ++astI) {
                var node = ast[astI];
                program.locs.push(node.location);
                switch (node.type) {
                    case Brainfuck.AST.NodeType.AddDataPtr:
                        program.ops.push({ type: VmOpType.AddDataPtr, value: node.value || 0, dataOffset: 0 });
                        break;
                    case Brainfuck.AST.NodeType.AddData:
                        program.ops.push({ type: VmOpType.AddData, value: node.value || 0, dataOffset: node.dataOffset || 0 });
                        break;
                    case Brainfuck.AST.NodeType.SetData:
                        program.ops.push({ type: VmOpType.SetData, value: node.value || 0, dataOffset: node.dataOffset || 0 });
                        break;
                    case Brainfuck.AST.NodeType.SystemCall:
                        program.ops.push({ type: VmOpType.SystemCall, value: node.systemCall || 0, dataOffset: 0 });
                        break;
                    case Brainfuck.AST.NodeType.BreakIf:
                        var afterSystemCall = program.ops.length + 2;
                        program.ops.push({ type: VmOpType.JumpIfNot, value: afterSystemCall, dataOffset: 0 });
                        program.ops.push({ type: VmOpType.SystemCall, value: Brainfuck.AST.SystemCall.Break, dataOffset: 0 });
                        break;
                    case Brainfuck.AST.NodeType.Loop:
                        var firstJump = { type: VmOpType.JumpIfNot, value: undefined, dataOffset: 0 };
                        program.ops.push(firstJump);
                        var afterFirstJump = program.ops.length;
                        compile(program, node.childScope);
                        var lastJump = { type: VmOpType.JumpIf, value: afterFirstJump, dataOffset: 0 };
                        program.ops.push(lastJump);
                        var afterLastJump = program.ops.length;
                        firstJump.value = afterLastJump;
                        break;
                    default:
                        console.error("Invalid node.type :=", node.type);
                        break;
                }
            }
        }
        VmCompiler.compile = compile;
        function badSysCall(vm) {
            console.error("Unexpected VmOpType", VmOpType[vm.code[vm.codePtr].type]);
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
                case VmOpType.AddDataPtr:
                    vm.dataPtr += op.value;
                    ++vm.codePtr;
                    break;
                case VmOpType.AddData:
                    vm.data[dp] = (op.value + 256 + (vm.data[dp] || 0)) % 256;
                    ++vm.codePtr;
                    break;
                case VmOpType.SetData:
                    vm.data[dp] = (op.value + 256) % 256;
                    ++vm.codePtr;
                    break;
                case VmOpType.JumpIf:
                    if (vm.data[dp])
                        vm.codePtr = op.value;
                    else
                        ++vm.codePtr;
                    break;
                case VmOpType.JumpIfNot:
                    if (!vm.data[dp])
                        vm.codePtr = op.value;
                    else
                        ++vm.codePtr;
                    break;
                case VmOpType.SystemCall:
                    (vm.sysCalls[op.value] || badSysCall)(vm);
                    ++vm.codePtr;
                    break;
                default:
                    badSysCall(vm);
                    break;
            }
        }
        function runSome(vm, maxInstructions) {
            var tStart = Date.now();
            for (var instructionsRan = 0; instructionsRan < maxInstructions; ++instructionsRan)
                runOne(vm);
            //console.log("Ran",instructionsRan,"instructions (IP=", vm.codePtr, "(", vm.code[vm.codePtr],") DP=", vm.dataPtr, "(", vm.data[vm.dataPtr] ,"))");
            var tStop = Date.now();
            vm.insRan += instructionsRan;
            vm.runTime += (tStop - tStart) / 1000;
        }
        function lpad(s, padding) { return padding.substr(0, padding.length - s.length) + s; }
        function addr(n) { return lpad(n.toString(16), "0x0000"); }
        function sourceLocToString(sl) { return !sl ? "unknown" : (sl.file + "(" + lpad(sl.line.toString(), "   ") + ")"); }
        function createDebugger(code, stdout) {
            var errors = false;
            var parseResult = Brainfuck.AST.parse({ code: code, onError: function (e) { if (e.severity == Brainfuck.AST.ErrorSeverity.Error)
                    errors = true; } });
            if (errors)
                return undefined;
            var program = { ops: [], locs: [] };
            compile(program, parseResult.optimizedAst);
            var vm = {
                code: program,
                data: [],
                codePtr: 0,
                dataPtr: 0,
                insRan: 0,
                runTime: 0,
                sysCalls: [],
            };
            var runHandle = undefined;
            var doPause = function () { if (runHandle !== undefined)
                clearInterval(runHandle); runHandle = undefined; };
            var doContinue = function () { if (runHandle === undefined)
                runHandle = setInterval(function () { return runSome(vm, 100000); }, 0); }; // Increase instruction limit after fixing loop perf?
            var doStop = function () { doPause(); vm.dataPtr = vm.data.length; };
            var doStep = function () { runOne(vm); };
            var getRegisters = function () { return [
                [" code", addr(vm.codePtr)],
                ["*code", vmOpToString(vm.code.ops[vm.codePtr])],
                ["@code", sourceLocToString(vm.code.locs[vm.codePtr])],
                [" data", addr(vm.dataPtr)],
                ["*data", (vm.data[vm.dataPtr] || "0").toString()],
                ["     ", ""],
                ["ran  ", vm.insRan.toLocaleString()],
                ["ran/s", ((vm.insRan / vm.runTime) | 0).toLocaleString()],
                ["    s", (vm.runTime | 0).toString()],
                ["     ", ""],
                ["code length (original)", code.length.toString()],
                ["code length (bytecode)", program.ops.length.toString()],
            ]; };
            var getCurrentPos = function () { return program.locs[vm.codePtr]; };
            var getThreads = function () { return [{
                    registers: getRegisters,
                    currentPos: getCurrentPos,
                }]; };
            var getMemory = function () { return vm.data; };
            var getState = function () {
                return vm === undefined ? DebugState.Detatched
                    : vm.codePtr >= vm.code.locs.length ? DebugState.Done
                        : runHandle !== undefined ? DebugState.Running
                            : DebugState.Paused;
            };
            vm.sysCalls[Brainfuck.AST.SystemCall.Putch] = function (vm) { return stdout(String.fromCharCode(vm.data[vm.dataPtr])); };
            vm.sysCalls[Brainfuck.AST.SystemCall.TapeEnd] = function (vm) { return doStop(); };
            return {
                state: getState,
                threads: getThreads,
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
            var script = UI.Editor.getScript();
            //theDebugger = Brainfuck.Eval.createDebugger(script, (stdout) => {
            theDebugger = Brainfuck.VmCompiler.createDebugger(script, function (stdout) {
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
        function Step() {
            theDebugger.step();
        }
        Debug.Step = Step;
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
                var theThread = theDebugger === undefined ? undefined : theDebugger.threads()[0];
                var thePos = theThread === undefined ? undefined : theThread.currentPos();
                setDebugState(theDebugger === undefined ? DebugState.Detatched : theDebugger.state());
                UI.Registers.update(theDebugger === undefined ? [] : theThread.registers());
                UI.Memory.update(theDebugger);
                UI.Editor.setCurrentPosition(thePos === undefined ? -1 : thePos.line, thePos === undefined ? -1 : thePos.column);
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
                _editor = ace.edit("editor");
                _editor.setTheme("ace/theme/monokai");
                var session = _editor.getSession();
                //session.setMode("ace/mode/javascript");
                session.setTabSize(4);
                session.setUseSoftTabs(false);
            }
            return _editor;
        }
        function getScript() {
            return editor().getValue();
        }
        Editor.getScript = getScript;
        function setScript(script) {
            editor().setValue(script);
        }
        Editor.setScript = setScript;
        function setTheme(theme) {
            editor().setTheme("ace/theme/" + theme.toLowerCase().replace(' ', '_'));
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
            var s = editor().getSession();
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
            var s = editor().getSession();
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
        addEventListener("load", function (e) {
            editor();
            // "Ace only resizes itself on window events. If you resize the editor div in another manner, and need Ace to resize, use the following"
            // Currently, console output, memory dump resizes, etc. may alter the editor div size.
            // Takes maybe ~5ms/check from an initial look at Chrome timeline results?  Not nearly my biggest perf issue atm.
            setInterval(function () { editor().resize(false); }, 100);
            setInterval(function () {
                var errors = [];
                Brainfuck.AST.parse({
                    code: getScript(),
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
            var lpad = "";
            var rpad = "                 ";
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