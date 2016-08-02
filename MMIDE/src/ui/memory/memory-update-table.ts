module UI {
	export module Memory {
		export function updateTable(memoryElement: HTMLElement, config: MemoryViewConfig, rows: Cell[][]) {
			let d3table = d3.select(memoryElement).select("table");
			if (d3table.empty()) d3table = d3.select(memoryElement).append("table").style("border-collapse", "collapse");

			let d3rows = d3table.selectAll("tr").data(rows);
			d3rows.enter().append("tr");
			d3rows.exit().remove();
			d3rows.each(function (row) {
				let rowElement = <HTMLTableRowElement> this;
				let d3cells = d3.select(rowElement).selectAll("td").data(row);
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
