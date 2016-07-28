module UI {
	export module Memory {
		const fancyTransitions	= false;
		const fasterTransitions	= false;

		interface Cell {
			type:		string; // e.g. memory-cell-address
			display:	string; // e.g. "....."
			data:		string; // e.g. "\x01\x04\x02.."
		}

		export function update(theDebugger: Debugger) {
			let els = document.getElementsByClassName("memory");
			for (let elI=0; elI<els.length; ++elI) {
				var el = <HTMLElement> els.item(elI);

				let b = (k: string) => { let value = el.dataset[k]; console.assert(value !== undefined); return value === "1" || value === "true"; };
				let i = (k: string) => { let value = parseInt(el.dataset[k]); console.assert(value !== undefined && !isNaN(value) && isFinite(value)); return value; }

				var baseAddress			= i("address");
				var nColSize			= i("colSize");
				var nCols				= i("cols");
				var nRows				= i("rows");
				var showLittleEndian	= b("littleEndian");
				var showAddress			= b("showAddress");
				var showHex				= b("showHex");
				var showData			= b("showData");

				var memory = theDebugger === undefined ? [] : theDebugger.memory();
				let getByte = (row: number, col: number, byte: number, littleEndian: boolean) => memory[baseAddress + (littleEndian ? nColSize - byte - 1 : byte) + nColSize * (col + nCols * row)] || 0; // TODO: Fix endian calc

				let d3table = d3.select(el).select("table");
				if (d3table.empty()) d3table = d3.select(el).append("table").style("border-collapse", "collapse");

				var tableCells : Cell[][] = [];
				for (let rowI=0; rowI < nRows; ++rowI) {
					let rowCells : Cell[] = [];
					tableCells.push(rowCells);

					if (showAddress) {
						let a = (baseAddress + nColSize * nCols * rowI).toString(16);
						let pad = "0x00000000";
						rowCells.push({type: "memory-cell-address", display: pad.substr(0, pad.length-a.length) + a, data: a});
					}

					if (showHex) {
						for (let colI=0; colI < nCols; ++colI) {
							let cellText = "";
							for (let byteI=0; byteI<nColSize; ++byteI) {
								let v = getByte(rowI, colI, byteI, showLittleEndian);
								var sv = v.toString(16);
								if (sv.length == 1) sv = "0" + sv;
								cellText += sv;
							}
							if (rowCells.length) rowCells.push({type: "memory-cell-padding", display: " ", data: " "});
							rowCells.push({type: "memory-cell-hex", display: cellText, data: cellText});
						}
					}

					if (showData) {
						if (rowCells.length) rowCells.push({type: "memory-cell-padding", display: " ", data: " "});
						for (let colI=0; colI < nCols; ++colI) {
							let offset = nColSize * (colI + (nCols * rowI));
							for (let byteI=0; byteI<nColSize; ++byteI) {
								let v = getByte(rowI, colI, byteI, false);
								let cellText = (32 <= v && v < 127) ? String.fromCharCode(v) : "."; // XXX: Abuse unicode? 127 = DEL, probably bad.
								let cellData = String.fromCharCode(v);
								rowCells.push({type: "memory-cell-data", display: cellText, data: cellData});
							}
						}
						//cells.push({type: "memory-cell-data", display: cellText, data: cellData});
					}
				}

				let d3rows = d3table.selectAll("tr").data(tableCells);
				d3rows.enter().append("tr");
				d3rows.exit().remove();
				d3rows.each(function (rowData) {
					let rowElement = <HTMLTableRowElement> this;
					let d3cells = d3.select(rowElement).selectAll("td").data(rowData);
					d3cells.exit().remove();

					d3cells.enter().append("td");
					//d3cells.attr("class",	cellData => cellData.type);
					d3cells.text(			cellData => cellData.display);

					if (fancyTransitions || fasterTransitions) {
						let prevStyle = undefined;
						d3cells.each(function(cellData) {
							let d3cell = d3.select(this);

							let prevMemoryValue = d3cell.attr("data-memory-value");
							d3cell.attr("data-memory-value", cellData.data);

							let dataChanged = prevMemoryValue !== undefined && prevMemoryValue !== null && prevMemoryValue !== cellData.data;
							if (dataChanged) {
								let transitionId = "highlight-changed";
								d3cell.interrupt(transitionId);
								d3cell.style("background-color", "#F44");

								if (fasterTransitions) { // fast ver
									d3cell
										.transition(transitionId)
											.delay(30).duration(0).style("background-color", "#FAA")
										.transition()
											//.delay(30).duration(0).style("background-color", "#DDD")
											.delay(30).duration(0).style("background-color", undefined)
										.transition()
											.style("background-color", undefined);
								} else {
									d3cell
										.transition(transitionId)
										//	.duration(100).style("background-color", "#FAA")
										//.transition()
											.duration(100).style("background-color", "#DDD")
										.transition()
											.style("background-color", undefined);
								}
							}
						});
						d3cells.attr("data-memory-value",	cd => cd.data);
					}
				});
				d3rows.order();
				//table.selectAll("tr")
			}
		}
	}
}
