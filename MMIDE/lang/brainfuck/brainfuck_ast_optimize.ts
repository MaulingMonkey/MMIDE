module Brainfuck {
	export module AST {
		export interface OptimizeArgs {
			ast:		Node[];
			onError:	(error: Error) => void;
		}

		// Optimize [..., a, ...]
		function singleOptimizations(args: OptimizeArgs): boolean {
			let changes = false;
			let ast = args.ast;

			for (let i=0; i<=ast.length-1; ++i) {
				let a = ast[i+0];

				// Single-op loop optimizations
				if (a.type === NodeType.Loop) {
					if (a.childScope.length === 0) {
						a = { type: NodeType.BreakIf, location: a.location };
					} else if (a.childScope.length === 1) {
						let c = a.childScope[0];
						switch (c.type) {
						case NodeType.AddData: // e.g. [-] [+] [----] etc.
							if (!!c.dataOffset) break;
							if ((c.value & 1) === 0) args.onError({ description: "Infinite loop if *data is even, *data = 0 otherwise.  If you just want to set *data = 0, prefer [-] or [+]", location: c.location, severity: ErrorSeverity.Warning });
							a = { type: NodeType.SetData, value: 0, location: a.location };
							changes = true;
							break;
						case NodeType.SetData: // e.g. [[-]]
							if (!!c.dataOffset) break;
							if (c.value !== 0) args.onError({ description: "Infinite loop if *data != 0 - prefer [] if intentional", location: c.location, severity: ErrorSeverity.Warning });
							a = { type: NodeType.SetData, value: 0, location: a.location };
							changes = true;
							break;
						}
					}
				}

				if (!a) { ast.splice(i+0,1); i-=1; } else { ast[i+0] = a; }
			}

			return changes;
		}

		// Optimize [..., a, b, ...]
		function pairOptimizations(args: OptimizeArgs): boolean {
			let changes = false;
			let ast = args.ast;

			for (let i=0; i<=ast.length-2; ++i) {
				let a = ast[i+0];
				let b = ast[i+1];

				// Collasing optimizations
				if (a.type === b.type) {
					switch (a.type) {
					case NodeType.AddDataPtr:														a.value = (a.value + b.value);				b = undefined; changes = true; break;
					case NodeType.AddData:		if ((a.dataOffset||0) !== (b.dataOffset||0)) break;	a.value = (a.value + b.value + 256) % 256;	b = undefined; changes = true; break;
					}
				} else {
					// Optimize set + add into a plain set
					if (a.type == NodeType.SetData && b.type == NodeType.AddData && (a.dataOffset||0) === (b.dataOffset||0)) {
						a.value = (a.value + b.value);
						b = undefined;
						changes = true;
					}
				}

				ast[i+0] = a;
				ast[i+1] = b;

				if (!a && !b)	ast.splice(i, 2);
				else if (!a)	ast.splice(i+0,1);
				else if (!b)	ast.splice(i+1,1);

				if (!a || !b) --i; // Rerun pair optimization against new pair
			}

			return changes;
		}

		// Optimize [..., a, b, c, ...]
		function triOptimizations(args: OptimizeArgs): boolean {
			let changes = false;
			let ast = args.ast;

			for (let i=0; i<=ast.length-3; ++i) {
				let a = ast[i+0];
				let b = ast[i+1];
				let c = ast[i+2];

				// Offset optimizations
				if (a.type === NodeType.AddDataPtr && c.type === NodeType.AddDataPtr && a.value === -c.value) {
					switch (b.type) {
					// e.g. <[-]> or >[+]< or >>>[+]<<< or ...
					//case NodeType.SetData:	a = { type: NodeType.SetData, location: a.location, dataOffset: a.value + (b.dataOffset||0), value: b.value }; b = c = undefined; break;
					// e.g. <-----> or >++++<
					case NodeType.AddData:
						let r = {
							type:		NodeType.AddData,
							location:	a.location,
							dataOffset:	a.value + (b.dataOffset || 0),
							value:		b.value
						};
						//console.log(nodeToString(a),nodeToString(b),nodeToString(c)," -> ",nodeToString(r));
						a = r;
						b = c = undefined;
						break;
					}
				}

				ast[i+0] = a;
				ast[i+1] = b;
				ast[i+2] = c;
				if (!c) ast.splice(i+2,1);
				if (!b) ast.splice(i+1,1);
				if (!a) ast.splice(i+0,1);

				if (!a || !b || !c) --i; // Rerun triple optimization against new triple
			}

			return changes;
		}

		export function optimize(args: OptimizeArgs): Node[] {
			args.ast.forEach(node => { if (node.childScope) node.childScope = optimize({ ast: node.childScope, onError: args.onError }); });

			//let optimizations = [];
			//let optimizations = [pairOptimizations, singleOptimizations];
			let optimizations = [pairOptimizations, singleOptimizations, triOptimizations];

			for (var optimizeAttempt=0; optimizeAttempt<100; ++optimizeAttempt) {
				if(!optimizations.some(o => o(args))) break; // Optimizations done
			}

			return args.ast;
		}
	}
}
