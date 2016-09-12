﻿module Brainfuck {
	export module AST {
		export enum NodeType {
			AddDataPtr,	// e.g. <>
			AddData,	// e.g. +-
			SystemCall,	// e.g. .,
			Loop,		// e.g. []

			// Psuedo-nodes generated by optimizer
			SetData,	// e.g. [-]  or "[+]" or "[+]+++++"
			AddMulData,	// e.g. [->++++++<]
			BreakIf,	// e.g. []
		}

		export interface Node {
			type:			NodeType;
			value?:			number;			// AddDataPtr, AddData, SetData
			dataOffset?:	number;			// AddData, SetData
			systemCall?:	SystemCall;		// SystemCall
			childScope?:	Node[];			// Loop
			location:		Debugger.SourceLocation;
		}

		export function nodeToString(node: Node) {
			return NodeType[node.type] + "(" +
				"v=" + ((node.value			=== undefined) ? "0" : node.value.toString()) + "," +
				"do=" + ((node.dataOffset	=== undefined) ? "0" : node.dataOffset.toString()) + "," +
				"sc=" + ((node.systemCall	=== undefined) ? "?" : SystemCall[node.systemCall]) + ")";
		}

		export function cloneNode(node: Node): Node {
			return {
				type:		node.type,
				value:		node.value,
				dataOffset:	node.dataOffset,
				systemCall:	node.systemCall,
				childScope:	cloneNodes(node.childScope),
				location:	node.location
			};
		}

		export function cloneNodes(nodes: Node[]): Node[] {
			return nodes === undefined ? undefined : nodes.map(node => cloneNode(node));
		}

		export function logAst(node: Node, indent: string) {
			switch (node.type) {
			case NodeType.AddDataPtr:	console.log(indent+"data += "+node.value); break;
			case NodeType.AddData:		console.log(indent+"data["+(node.dataOffset|0)+"] += "+node.value); break;
			case NodeType.AddMulData:	console.log(indent+"data["+(node.dataOffset|0)+"] += data[0] * "+node.value); break;
			case NodeType.SetData:		console.log(indent+"data["+(node.dataOffset|0)+"] <- "+node.value); break;
			case NodeType.BreakIf:		console.log(indent+"breakIf"); break;
			case NodeType.SystemCall:	console.log(indent+"syscall "+SystemCall[node.systemCall]); break;
			case NodeType.Loop:
					console.log(indent+"while (data["+(node.dataOffset|0)+"] != 0)");
					node.childScope.forEach(child => logAst(child, indent+"    "));
					break;
			}
		}
	}
}