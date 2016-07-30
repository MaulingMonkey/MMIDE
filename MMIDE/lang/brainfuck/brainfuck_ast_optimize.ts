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

			for (var i=0; i<=ast.length-1; ++i) {
				let a = ast[i+0];

				let replace = (...nodes: Node[]) => { ast.splice(i, 1, ...nodes); --i; changes = true; };

				// Single-op loop optimizations
				if (a.type === NodeType.Loop) {
					if (a.childScope.length === 0) {
						replace({ type: NodeType.BreakIf, location: a.location });
					} else if (a.childScope.length === 1) {
						let c = a.childScope[0];
						switch (c.type) {
						case NodeType.AddData: // e.g. [-] [+] [----] etc.
							if (!!c.dataOffset) break;
							if ((c.value & 1) === 0) args.onError({ description: "Infinite loop if *data is even, *data = 0 otherwise.  If you just want to set *data = 0, prefer [-] or [+]", location: c.location, severity: ErrorSeverity.Warning });
							replace({ type: NodeType.SetData, value: 0, location: a.location });
							break;
						case NodeType.SetData: // e.g. [[-]]
							if (!!c.dataOffset) break;
							if (c.value !== 0) args.onError({ description: "Infinite loop if *data != 0 - prefer [] if intentional", location: c.location, severity: ErrorSeverity.Warning });
							replace({ type: NodeType.SetData, value: 0, location: a.location });
							changes = true;
							break;
						}
					}
				}
			}

			return changes;
		}

		// Optimize [..., a, b, ...]
		function pairOptimizations(args: OptimizeArgs): boolean {
			let changes = false;
			let ast = args.ast;

			for (var i=0; i<=ast.length-2; ++i) {
				let a = ast[i+0];
				let b = ast[i+1];

				let replace = (...nodes: Node[]) => { ast.splice(i, 2, ...nodes); --i; changes = true; };

				// Collasing optimizations
				if (a.type === b.type) {
					switch (a.type) {
					case NodeType.AddDataPtr:														a.value = (a.value + b.value);				replace(a); break;
					case NodeType.AddData:		if ((a.dataOffset||0) !== (b.dataOffset||0)) break;	a.value = (a.value + b.value + 256) % 256;	replace(a); break;
					}
				} else {
					// Optimize set + add into a plain set
					if (a.type == NodeType.SetData && b.type == NodeType.AddData && (a.dataOffset||0) === (b.dataOffset||0)) {
						a.value = (a.value + b.value);
						replace(a);
					}
				}
			}

			return changes;
		}

		// Optimize [..., a, b, c, ...]
		function triOptimizations(args: OptimizeArgs): boolean {
			let changes = false;
			let ast = args.ast;

			for (var i=0; i<=ast.length-3; ++i) {
				let a = ast[i+0];
				let b = ast[i+1];
				let c = ast[i+2];

				let replace = (...nodes: Node[]) => { ast.splice(i, 3, ...nodes); --i; changes = true; };

				// Offset optimizations
				if (a.type === NodeType.AddDataPtr && c.type === NodeType.AddDataPtr && a.value === -c.value) {
					switch (b.type) {
					// e.g. <[-]> or >[+]< or >>>[+]<<< or ...
					case NodeType.SetData:
						replace({
							type:		NodeType.SetData,
							location:	a.location,
							dataOffset:	a.value + (b.dataOffset||0),
							value:		b.value
						});
						break;
					// e.g. <-----> or >++++<
					case NodeType.AddData:
						replace({
							type:		NodeType.AddData,
							location:	a.location,
							dataOffset:	a.value + (b.dataOffset || 0),
							value:		b.value
						});
						break;
					}
				}
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
