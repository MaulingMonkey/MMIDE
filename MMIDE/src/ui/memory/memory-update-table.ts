module UI {
	export module Memory {
		// Slow on IE (~130-220ms without animation, 190-250ms with full duration animation)
		function doUpdateTableD3(memoryElement: HTMLElement, config: MemoryViewConfig, rows: Cell[][]) {
			let d3table = d3.select(memoryElement).select("table");
			if (d3table.empty()) {
				memoryElement.innerText = ""; // Clear possible previous text nodes
				d3table = d3.select(memoryElement).append("table").style("border-collapse", "collapse");
			}

			let d3rows = d3table.selectAll("tr").data(rows);
			d3rows.enter().append("tr");
			d3rows.exit().remove();
			d3rows.each(function (row) {
				let rowElement = <HTMLTableRowElement> this;
				let d3cells = d3.select(rowElement).selectAll("td").data(row);
				d3cells.exit().remove();

				let d3NewCells = d3cells.enter().append("td");
				//d3NewCells.style("position","absolute").style("left","0").style("top","0").style("width","2em").style("height","2em"); // Test to see if this helps perf - it doesn't
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

		// Slow on IE (~130-210ms), not much faster than doUpdateTableD3
		function doUpdateTableD3Hybrid(memoryElement: HTMLElement, config: MemoryViewConfig, rows: Cell[][]) {
			let d3table = d3.select(memoryElement).select("table");
			if (d3table.empty()) {
				memoryElement.innerText = ""; // Clear possible previous text nodes
				d3table = d3.select(memoryElement).append("table").style("border-collapse", "collapse");
			}

			let d3rows = d3table.selectAll("tr").data(rows);
			d3rows.enter().append("tr");
			d3rows.exit().remove();
			d3rows.each(function (row) {
				let rowElement = <HTMLTableRowElement> this;
				let d3cells = d3.select(rowElement).selectAll("td").data(row);
				d3cells.exit().remove();

				d3cells.enter().append("td");

				d3cells.each(function (cell) {
					let cellElement = <HTMLTableCellElement> this;
					cellElement.textContent = cell.display;
				});
			});
			d3rows.order();
		}

		const htmlEntityMap = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;',
			'/': '&#x2F;',
			'`': '&#x60;',
			'=': '&#x3D;'
		};
		function escapeHtml(text: string): string { return String(text).replace(/[&<>"'`=\/]/g, fragment => htmlEntityMap[fragment]); }

		// Faster than doUpdateTableD3 et all (~30±5 ms on IE) but could be faster
		function doUpdateTableHtml(memoryElement: HTMLElement, config: MemoryViewConfig, rows: Cell[][]) {
			let html = "";

			html += "<table style=\"border-collapse: collapse\">\n";

			rows.forEach(row => {
				html += "\t<tr>";

				row.forEach(cell => {
					html += "<td>";
					html += escapeHtml(cell.display);
					html += "</td>";
				});

				html += "</tr>\n";
			});

			memoryElement.innerHTML = html;
		}

		// Sufficiently fast on IE (~15ms±3 ms on IE)
		let prevRows : string[][] = [];
		function updateCellChanged(col: number, row: number, value: string): boolean {
			let prevRow = prevRows[row] = prevRows[row] || [];
			let changed = prevRow[col] !== value;
			prevRow[col] = value;
			return changed;
		}

		function doUpdateTableCanvas(memoryElement: HTMLElement, config: MemoryViewConfig, rows: Cell[][]) {
			let d3canvas = d3.select(memoryElement).select("canvas");
			if (d3canvas.empty()) {
				memoryElement.innerText = ""; // Clear possible previous text nodes
				d3canvas = d3.select(memoryElement).append("canvas");
			}

			let font = "8pt Consolas, Courier New, Courier, monospace";
			//let font = "8pt Consolas"
			let canvas = <HTMLCanvasElement> d3canvas[0][0];
			let context = canvas.getContext("2d");
			context.font = font;


			// Layout
			let colWidths = [];
			//let rowHeights = []; // XXX: measureText().width is all we can rely on for now
			rows.forEach((row, rowI) => {
				row.forEach((cell, cellI) => {
					let m = context.measureText(cell.display);
					colWidths[cellI] = Math.max((colWidths[cellI]||0), m.width);
				});
			});

			let totalWidth = 0;
			colWidths.forEach(w => totalWidth += w);

			//let rowHeight = 16; // Arbitrary
			let rowHeight = 13; // Arbitrary
			let totalHeight = rows.length * rowHeight - 3;



			// DOM Layout
			canvas.width = canvas.clientWidth = totalWidth;
			canvas.height = canvas.clientHeight = totalHeight;
			context = canvas.getContext("2d"); // XXX: Not sure if this is necessary
			context.font = font;


			// Render
			context.fillStyle = 'rgba(0,0,0,0.0)';
			context.clearRect(0, 0, canvas.width, canvas.height);

			let y=0;
			rows.forEach((row, rowI) => {
				//let rowHeight = rowHeight;
				let x=0;
				row.forEach((cell, cellI) => {
					let colWidth = colWidths[cellI];
					if (updateCellChanged(cellI, rowI, cell.data)) {
						context.fillStyle = '#F66';
						context.fillRect(x, y-1, colWidth, rowHeight);
					}
					context.fillStyle = '#000';
					context.fillText(cell.display, x, y+rowHeight-3, colWidth);
					x += colWidth;
				});
				y += rowHeight;
			});
		}

		// Fucking fast (~1±1ms on IE)
		function doUpdateTableText(memoryElement: HTMLElement, config: MemoryViewConfig, rows: Cell[][]) {
			let text = "";

			rows.forEach(row => {
				row.forEach(cell => {
					text += cell.display;
				});
				text += "\n";
			});

			memoryElement.innerText = text;
		}

		const updateD3TooSlowThreshhold = 30; // ms
		let updateD3TooSlow = false;
		function doUpdateTableSmart(memoryElement: HTMLElement, config: MemoryViewConfig, rows: Cell[][]) {
			if (!updateD3TooSlow) { // Slow path - sufficient on Chrome, too slow on IE
				let s = Date.now();
				doUpdateTableD3(memoryElement, config, rows);
				let e = Date.now()-s;
				if (e >= updateD3TooSlowThreshhold && !updateD3TooSlow) {
					console.warn("doUpdateTableD3 took too long ("+e+"ms >= "+updateD3TooSlowThreshhold+"ms) to execute, falling back on doUpdateTableText & doUpdateTableCanvas");
					updateD3TooSlow = true;
				}
			} else if (config.dataChangedDisplay) { // Medium path - sufficiently fast on IE, actually slower on Chrome than the d3 path (not by measurement, but by update frequency)
				doUpdateTableCanvas(memoryElement, config, rows);
			} else { // Fastest path - minor layout differences vs e.g. doUpdateTableD3
				doUpdateTableText(memoryElement, config, rows);
			}
		}

		//export const updateTable = debounce(measure(doUpdateTableSmart, "updateTable"), 10);
		export const updateTable = debounce(doUpdateTableSmart,10);

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
	}
}
