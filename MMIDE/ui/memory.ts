module UI {
	export module Memory {
		const fancyTransitions	= false;
		const fasterTransitions	= false;

		interface Cell {
			type:		string; // e.g. memory-cell-address
			display:	string; // e.g. "....."
			data:		string; // e.g. "\x01\x04\x02.."
		}

		enum DataChangedDisplay {
			None,
			DelayHighlight,
			DurationHighlight,
		}

		interface MemoryViewConfig {
			baseAddress			: number;
			nColSize			: number;
			nCols				: number;
			nRows				: number;
			showLittleEndian	: boolean;
			showAddress			: boolean;
			showHex				: boolean;
			showData			: boolean;
			dataChangedDisplay	: DataChangedDisplay;
		}

		function getMemoryViewConfig(el: HTMLElement): MemoryViewConfig {
			let bool	= (k: string) => { let value = el.dataset[k];			console.assert(value !== undefined && value !== null);										return value === "1" || value === "true"; };
			let string	= (k: string) => { let value = el.dataset[k];			console.assert(value !== undefined && value !== null);										return value; }
			let int		= (k: string) => { let value = parseInt(el.dataset[k]);	console.assert(value !== undefined && value !== null && !isNaN(value) && isFinite(value));	return value; }

			return {
				baseAddress			: int("address"),
				nColSize			: int("colSize"),
				nCols				: int("cols"),
				nRows				: int("rows"),
				showLittleEndian	: bool("littleEndian"),
				showAddress			: bool("showAddress"),
				showHex				: bool("showHex"),
				showData			: bool("showData"),
				dataChangedDisplay	: DataChangedDisplay[string("changedDisplay")],
			};
		}

		function getByte(memory: number[], config: MemoryViewConfig, rowI: number, colI: number, byteI: number, littleEndian: boolean) {
			return memory[config.baseAddress + (littleEndian ? config.nColSize - byteI - 1 : byteI) + config.nColSize * (colI + config.nCols * rowI)] || 0;
		}

		function appendAddressCell(rowCells: Cell[], config: MemoryViewConfig, rowI: number) {
			if (config.showAddress) {
				let a = (config.baseAddress + config.nColSize * config.nCols * rowI).toString(16);
				let pad = "0x00000000";
				rowCells.push({type: "memory-cell-address", display: pad.substr(0, pad.length-a.length) + a, data: a});
			}
		}

		function appendHexCells(rowCells: Cell[], config: MemoryViewConfig, rowI: number, memory: number[]) {
			for (let colI=0; colI < config.nCols; ++colI) {
				let cellText = "";
				for (let byteI=0; byteI<config.nColSize; ++byteI) {
					let v = getByte(memory, config, rowI, colI, byteI, config.showLittleEndian);
					var sv = v.toString(16);
					if (sv.length == 1) sv = "0" + sv;
					cellText += sv;
				}
				if (rowCells.length) rowCells.push({type: "memory-cell-padding", display: " ", data: " "});
				rowCells.push({type: "memory-cell-hex", display: cellText, data: cellText});
			}
		}

		function appendDataCells(rowCells: Cell[], config: MemoryViewConfig, rowI: number, memory: number[]) {
			if (rowCells.length) rowCells.push({type: "memory-cell-padding", display: " ", data: " "});
			for (let colI=0; colI < config.nCols; ++colI) {
				let offset = config.nColSize * (colI + (config.nCols * rowI));
				for (let byteI=0; byteI<config.nColSize; ++byteI) {
					let v = getByte(memory, config, rowI, colI, byteI, false);
					let cellText = (32 <= v && v < 127) ? String.fromCharCode(v) : "."; // XXX: Abuse unicode? 127 = DEL, probably bad.
					let cellData = String.fromCharCode(v);
					rowCells.push({type: "memory-cell-data", display: cellText, data: cellData});
				}
			}
		}

		function collectTableCells(config: MemoryViewConfig, memory: number[]): Cell[][] {
			var table : Cell[][] = [];
			for (let rowI = 0; rowI < config.nRows; ++rowI) {
				let row : Cell[] = [];
				if (config.showAddress)	appendAddressCell	(row, config, rowI);
				if (config.showHex)		appendHexCells		(row, config, rowI, memory);
				if (config.showData)	appendDataCells		(row, config, rowI, memory);
				table.push(row);
			}
			return table;
		}

		function applyDataChangedTransition(config: MemoryViewConfig, d3cell: d3.Selection<any>) {
			let transitionId = "highlight-changed";
			d3cell.interrupt(transitionId);
			d3cell.style("background-color", "#F44");

			switch (config.dataChangedDisplay) {
			case DataChangedDisplay.DelayHighlight:
				d3cell
					.transition(transitionId)	.delay(30).duration(0).style("background-color", "#FAA")
					.transition()				.delay(30).duration(0).style("background-color", "#ECC")
					.transition()				.delay(30).duration(0).style("background-color", undefined);
				break;
			case DataChangedDisplay.DurationHighlight:
				d3cell
					.transition(transitionId)	.duration(100).style("background-color", "#FAA")
					.transition()				.duration(100).style("background-color", "#DDD")
					.transition()				.style("background-color", undefined);
				break;
			}
		}

		function d3UpdateTable(el: HTMLElement, config: MemoryViewConfig, table: Cell[][]) {
			let d3table = d3.select(el).select("table");
			if (d3table.empty()) d3table = d3.select(el).append("table").style("border-collapse", "collapse");

			let d3rows = d3table.selectAll("tr").data(table);
			d3rows.enter().append("tr");
			d3rows.exit().remove();
			d3rows.each(function (rowData) {
				let rowElement = <HTMLTableRowElement> this;
				let d3cells = d3.select(rowElement).selectAll("td").data(rowData);
				d3cells.exit().remove();

				d3cells.enter().append("td");
				//d3cells.attr("class",	cellData => cellData.type);
				d3cells.text(			cellData => cellData.display);

				if (config.dataChangedDisplay) {
					let prevStyle = undefined;
					d3cells.each(function(cellData) {
						let d3cell = d3.select(this);

						let prevMemoryValue = d3cell.attr("data-memory-value");
						d3cell.attr("data-memory-value", cellData.data);

						let dataChanged = prevMemoryValue !== undefined && prevMemoryValue !== null && prevMemoryValue !== cellData.data;
						if (dataChanged) applyDataChangedTransition(config, d3cell);
					});
					d3cells.attr("data-memory-value",	cd => cd.data);
				}
			});
			d3rows.order();
		}

		export function update(theDebugger: Debugger) {
			var memory = theDebugger === undefined ? [] : theDebugger.memory();
			let getByte = (row: number, col: number, byte: number, littleEndian: boolean) => memory[config.baseAddress + (littleEndian ? config.nColSize - byte - 1 : byte) + config.nColSize * (col + config.nCols * row)] || 0;

			let els = document.getElementsByClassName("memory");
			for (let elI=0; elI<els.length; ++elI) {
				var el = <HTMLElement> els.item(elI);
				var config = getMemoryViewConfig(el);
				var table = collectTableCells(config, memory);
				d3UpdateTable(el, config, table);
			}
		}
	}
}
