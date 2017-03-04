module Brainfuck {
	export module VmCompiler {
		export function compileProgram(ast: AST.Node[]): Program {
			let program : Program = { ops: [], locs: [] };
			compile(program, ast);
			return program;
		}

		function compile(program: Program, ast: AST.Node[]) {
			for (let astI=0; astI<ast.length; ++astI) {
				var node = ast[astI];

				let push = (op: VmOp) => {
					program.ops.push(op);
					program.locs.push(node.location);
				};

				switch (node.type) {
					case AST.NodeType.AddDataPtr:	push({type: VmOpType.AddDataPtr,	value: node.value || 0,			dataOffset: node.dataOffset || 0,	srcOffset: node.srcOffset || 0 }); break;
					case AST.NodeType.AddData:		push({type: VmOpType.AddData,		value: node.value || 0,			dataOffset: node.dataOffset || 0,	srcOffset: node.srcOffset || 0 }); break;
					case AST.NodeType.AddMulData:	push({type: VmOpType.AddMulData,	value: node.value || 0,			dataOffset: node.dataOffset || 0,	srcOffset: node.srcOffset || 0 }); break;
					case AST.NodeType.SetData:		push({type: VmOpType.SetData,		value: node.value || 0,			dataOffset: node.dataOffset || 0,	srcOffset: node.srcOffset || 0 }); break;
					case AST.NodeType.SystemCall:	push({type: VmOpType.SystemCall,	value: node.systemCall || 0,	dataOffset: node.dataOffset || 0,	srcOffset: node.srcOffset || 0 }); break;
					case AST.NodeType.BreakIf:
						let afterSystemCall = program.ops.length+2;
						push({type: VmOpType.JumpIfNot,		value: afterSystemCall,			dataOffset: node.dataOffset || 0,	srcOffset: node.srcOffset || 0 });
						push({type: VmOpType.SystemCall,	value: AST.SystemCall.Break,	dataOffset: node.dataOffset || 0,	srcOffset: node.srcOffset || 0 });
						break;
					case AST.NodeType.Loop:
						let firstJump = {type: VmOpType.JumpIfNot, value: undefined, dataOffset: node.dataOffset || 0,	srcOffset: node.srcOffset || 0 };
						push(firstJump);
						let afterFirstJump = program.ops.length;

						compile(program, node.childScope);

						let lastJump = {type: VmOpType.JumpIf, value: afterFirstJump, dataOffset: node.dataOffset || 0,	srcOffset: node.srcOffset || 0 };
						push(lastJump);
						let afterLastJump = program.ops.length;

						firstJump.value = afterLastJump;
						break;
					default:
						console.error("Invalid node.type :=",node.type);
						break;
				}
			}
		}
	}
}
