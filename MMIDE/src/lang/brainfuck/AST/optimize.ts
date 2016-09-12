module Brainfuck {
	export module AST {
		export interface OptimizeArgs {
			ast:		Node[];
			onError:	(error: Error) => void;
		}

		function sign(a: number): number { return a>0 ? +1 : a<0 ? -1 : 0; }

		// Optimize [..., a, ...]
		function singleOptimizations(args: OptimizeArgs): boolean {
			let changes = false;
			let ast = args.ast;

			for (var i=0; i<=ast.length-1; ++i) {
				let a = ast[i+0];

				let replace = (...nodes: Node[]) => { ast.splice(i, 1, ...nodes); --i; changes = true; };

				// Single-op loop optimizations
				switch (a.type) {
				case NodeType.Loop:
					if (a.childScope.length === 0) {
						replace({ type: NodeType.BreakIf, location: a.location });
					} else if (a.childScope.length === 1) {
						let c = a.childScope[0];
						switch (c.type) {
						case NodeType.AddData: // e.g. [-] [+] [----] etc.
							if (!!c.dataOffset) break;
							if ((c.value & 1) === 0) args.onError({ description: "Infinite loop if *data is even, *data = 0 otherwise.  If you just want to set *data = 0, prefer [-] or [+]", location: c.location, severity: ErrorSeverity.Warning });
							replace({ type: NodeType.SetData, value: 0, dataOffset: 0, location: a.location });
							break;
						case NodeType.SetData: // e.g. [[-]]
							if (!!c.dataOffset) break;
							if (c.value !== 0) args.onError({ description: "Infinite loop if *data != 0 - prefer [] if intentional", location: c.location, severity: ErrorSeverity.Warning });
							replace({ type: NodeType.SetData, value: 0, dataOffset: 0, location: a.location });
							changes = true;
							break;
						}
					} else if (a.childScope.every(c => c.type === NodeType.AddData)) {
						// Optimize this common pattern:
						// while (data[0] != 0)
						//		data[0] += -1
						//		data[1] += 2
						//		data[4] += 5
						//		data[5] += 2
						//		data[6] += 1
						let data0	= a.childScope.filter(c => !c.dataOffset);
						let dataNZ	= a.childScope.filter(c => !!c.dataOffset);
						if (data0.length === 1 && data0[0].value === -1) { // [-......] - could optimize [+.......] as well?
							let mulNZ = dataNZ.map(d =>{
								return { type: NodeType.AddMulData, value: d.value, dataOffset: d.dataOffset, location: d.location };
							});
							let set0 = { type: NodeType.SetData, value: 0, dataOffset: 0, location: data0[0].location };
							replace(...mulNZ, set0);
						}
					}
					break;
				case NodeType.AddData: // data[...] += 0
					if (a.value === 0) replace();
					break;
				case NodeType.AddDataPtr: // data += 0
					if (a.value === 0) replace();
					break;
				}
			}

			return changes;
		}

		// Optimize [..., l, r, ...]
		function pairOptimizations(args: OptimizeArgs): boolean {
			let changes = false;
			let ast = args.ast;

			for (var i=0; i<=ast.length-2; ++i) {
				let l = ast[i+0];
				let r = ast[i+1];

				let replace = (...nodes: Node[]) => { ast.splice(i, 2, ...nodes); --i; changes = true; };

				// Collasing optimizations
				if (l.type === r.type) {
					switch (l.type) {
					case NodeType.AddDataPtr:														l.value = (l.value + r.value);		replace(l); break;
					case NodeType.AddData:		if ((l.dataOffset|0) !== (r.dataOffset|0)) break;	l.value = (l.value + r.value)&0xFF;	replace(l); break;
					}
				} else {
					// Optimize set + add into a plain set
					if (l.type == NodeType.SetData && r.type == NodeType.AddData && (l.dataOffset|0) === (r.dataOffset|0)) {
						l.value = (l.value + r.value);
						replace(l);
					}
				}
			}

			return changes;
		}

		// Not strictly speaking an optimization in and of itself - but we want to rewrite operations like:
		//		>>> [data[0] = ...] .... <<<
		// As:
		//		[data[3] = ...] >>> .... <<<
		// Such that additional triOptimizations can take place if e.g. .... is another set operation
		function shiftMutsLeft(args: OptimizeArgs): boolean {
			let changes = false;
			let ast = args.ast;

			for (var i=0; i<=ast.length-2; ++i) {
				let l = ast[i+0];
				let r = ast[i+1];

				let replace = (...nodes: Node[]) => { ast.splice(i, 2, ...nodes); --i; changes = true; };

				if (l.type === NodeType.AddDataPtr) {
					switch (r.type) {
					case NodeType.AddData: // e.g. >>>>++++
					case NodeType.SetData: // e.g. >>>>[-]+++
						replace({ type: r.type, location: r.location, dataOffset: (r.dataOffset|0) + l.value, value: r.value },
								{ type: l.type, location: l.location, dataOffset: l.dataOffset, value: l.value });
						break;
					}
				}
			}

			return changes;
		}

		// Optimize [..., l, meat, r, ...]
		function triOptimizations(args: OptimizeArgs): boolean {
			let changes = false;
			let ast = args.ast;

			for (var i=0; i<=ast.length-3; ++i) {
				let l    = ast[i+0];
				let meat = ast[i+1];
				let r    = ast[i+2];

				let replace = (...nodes: Node[]) => { ast.splice(i, 3, ...nodes); --i; changes = true; };

				// Offset optimizations

				// E.g. <[-]> or >[+]< or >>>[+]<<< or <-----> or >++++< or ...
				if (l.type === NodeType.AddDataPtr && r.type === NodeType.AddDataPtr && sign(l.value) !== sign(r.value)) {
					let minMag = Math.min(Math.abs(l.value),Math.abs(r.value));
					let maxMag = Math.max(Math.abs(l.value),Math.abs(r.value));
					let diffMag= maxMag-minMag;

					if (l.value === -r.value) { // Perfectly balanced (neither Left nor Right retained)
						switch (meat.type) {
						case NodeType.SetData: // e.g. <[-]> or >[+]< or >>>[+]<<< or ...
						case NodeType.AddData: // e.g. <-----> or >++++<
							replace({ type: meat.type, location: l.location, dataOffset: l.value + (meat.dataOffset|0), value: meat.value });
							break;
						}
					} else if (Math.abs(l.value) > Math.abs(r.value)) { // Imperfectly balanced (Left partially retained)
						switch (meat.type) {
						case NodeType.SetData: // e.g. < <[-]> or > >[+]< or >>>>> >>>[+]<<< or ...
						case NodeType.AddData: // e.g. < <-----> or > >++++<
							replace({ type: l.type,		location: l.location, dataOffset: l.dataOffset,									value: sign(l.value)*diffMag },
									{ type: meat.type,	location: l.location, dataOffset: sign(l.value)*minMag + (meat.dataOffset|0),	value: meat.value });
							break;
						}
					} else if (Math.abs(l.value) < Math.abs(r.value)) { // Imperfectly balanced (Right partially retained)
						switch (meat.type) {
						case NodeType.SetData: // e.g. <[-]> >>> or >[+]< << or >>>[+]<<< <<< or ...
						case NodeType.AddData: // e.g. <-----> >> or >++++< <<<
							replace({ type: meat.type,	location: l.location, dataOffset: sign(l.value)*minMag + (meat.dataOffset|0),	value: meat.value },
									{ type: r.type,		location: r.location, dataOffset: r.dataOffset,									value: sign(r.value)*diffMag });
							break;
						}
					}
				}
			}

			return changes;
		}

		export function optimize(args: OptimizeArgs): Node[] {
			args.ast.forEach(node => { if (node.childScope) node.childScope = optimize({ ast: node.childScope, onError: args.onError }); });

			//let optimizations = [pairOptimizations, singleOptimizations, triOptimizations];
			let optimizations = [pairOptimizations, singleOptimizations, triOptimizations, shiftMutsLeft];

			for (var optimizeAttempt=0; optimizeAttempt<100; ++optimizeAttempt) {
				if(!optimizations.some(o => o(args))) break; // Optimizations done
			}

			return args.ast;
		}
	}
}
