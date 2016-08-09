module UI {
	export module Breakpoints {
		//const log = (m,...a) => console.log(m,...a);
		const log = (m,...a) => {};

		function isBreakpointActive(breakpoint: Breakpoint): boolean {
			return breakpoint.enabled && !!breakpoint.location;
		}

		function isBreakpointBlank(breakpoint: Breakpoint): boolean {
			return !breakpoint.location && !breakpoint.condition && !breakpoint.onHit;
		}

		function isBreakpointCullable(breakpoint: Breakpoint, ignoreFocus: boolean): boolean {
			return isBreakpointBlank(breakpoint) && (ignoreFocus || !isBreakpointFocused(breakpoint));
		}

		function isBreakpointFocused(breakpoint: Breakpoint): boolean {
			if (!breakpoint.elements) return false;

			let active = document.activeElement;
			return active === breakpoint.elements.enabled ||
				active === breakpoint.elements.condition ||
				active === breakpoint.elements.location ||
				active === breakpoint.elements.onHit;
		}

		function newBreakpointRow(tableElement: HTMLTableElement, breakpoint: Breakpoint): HTMLTableRowElement {
			if (!breakpoint) breakpoint = { enabled: true, location: "", condition: "", onHit: "" };

			let d3body = d3.select(tableElement).select("tbody");
			if (d3body.empty()) d3body = d3.select(tableElement).append("tbody");

			let newRow = d3body.append("tr");
			newRow.classed("breakpoint-row", true);

			let d3cols = d3.select(tableElement).select("thead").selectAll("[data-breakpoint-column]");
			d3cols.each(function() {
				let header = <HTMLTableHeaderCellElement>this;
				let colType = header.dataset["breakpointColumn"];
				let newCell = newRow.append("td");
				switch (colType) {
					case "location":
						let e = newCell.append("input").classed("breakpoint-enabled", true).attr({type: "checkbox", title: "Enabled", alt: "Enabled"});
						if (breakpoint.enabled) e.attr("checked","");
						newCell.append("span").text(" ");
						newCell.append("input").classed("breakpoint-location", true).attr({type: "text", value: breakpoint.location || "", placeholder: "(no location)"});
						break;
					case "condition":
						newCell.append("input").classed("breakpoint-condition",true).attr({type: "text", value: breakpoint.condition || "", placeholder: "(no condition)"});
						break;
					case "on-hit":
						newCell.append("input").classed("breakpoint-on-hit",true).attr({type: "text", value: breakpoint.onHit || "", placeholder: "(no action on hit)"});
						break;
					default:
						console.error("Unexpected data-breakpoint-column:", colType);
						break;
				}
			});

			let rowElement = newRow[0][0];
			return <HTMLTableRowElement>rowElement;
		}



		interface BreakpointRowElements {
			row?:			HTMLTableRowElement;
			enabled:		HTMLInputElement;
			location:		HTMLInputElement;
			condition:		HTMLInputElement;
			onHit:			HTMLInputElement;
		}
		function getRowBreakpointElements(row: HTMLTableRowElement): BreakpointRowElements {
			let eEnabled	= <HTMLInputElement> row.getElementsByClassName("breakpoint-enabled").item(0);
			let eLocation	= <HTMLInputElement> row.getElementsByClassName("breakpoint-location").item(0);
			let eCondition	= <HTMLInputElement> row.getElementsByClassName("breakpoint-condition").item(0);
			let eOnHit		= <HTMLInputElement> row.getElementsByClassName("breakpoint-on-hit").item(0);

			let breakpointElements = {
				row:		row,
				enabled:	eEnabled,
				location:	eLocation,
				condition:	eCondition,
				onHit:		eOnHit,
			};

			return breakpointElements;
		}
		function getTableBreakpointElements(tableElement: HTMLTableElement): BreakpointRowElements[] {
			let breakpointElements : BreakpointRowElements[] = [];
			d3.select(tableElement).select("tbody").selectAll(".breakpoint-row").each(function(){
				let row = <HTMLTableRowElement>this;
				breakpointElements.push(getRowBreakpointElements(row));
			});
			return breakpointElements;
		}



		interface Breakpoint {
			elements?:		BreakpointRowElements;
			enabled:		boolean;
			location:		string;
			condition:		string;
			onHit:			string;
		}
		function getTableBreakpoints(tableElement: HTMLTableElement): Breakpoint[] {
			return getTableBreakpointElements(tableElement).map(elements => {
				return {
					elements:	elements,
					enabled:	elements.enabled.checked,
					location:	elements.location.value,
					condition:	elements.condition.value,
					onHit:		elements.onHit.value,
				};
			});
		}
		function isBreakpointEqual(lhs: Breakpoint, rhs: Breakpoint): boolean {
			return lhs.elements === rhs.elements &&
				lhs.location === rhs.location &&
				lhs.condition === rhs.condition &&
				lhs.onHit === rhs.onHit;
		}
		function breakpointListsAreEqual(lhs: Breakpoint[], rhs: Breakpoint[]): boolean {
			if (!!lhs !== !!rhs) return false;
			if (lhs.length !== rhs.length) return false;
			for (let i=0, n=lhs.length; i<n; ++i) if (!isBreakpointEqual(lhs[i], rhs[i])) return false;
			return true;
		}



		function manageSingleBlankBreakpoint(tableElement: HTMLTableElement) {
			let breakpoints = getTableBreakpoints(tableElement);

			if (breakpoints.length == 0) {
				newBreakpointRow(tableElement, undefined);
			} else {
				let lastBreakpoint = breakpoints[breakpoints.length-1];
				breakpoints.filter(bp => isBreakpointBlank(bp) && !isBreakpointFocused(bp) && bp != lastBreakpoint).forEach(e => e.elements.row.remove());
				if (!isBreakpointBlank(lastBreakpoint)) newBreakpointRow(tableElement, undefined);
			}
		}



		const reFileLine = /^(.+)(?:(?:\((\d+)\))|(?:\:(\d+)))$/;
		var prevBreakpoints : Breakpoint[] = [];
		addEventListener("load", ()=>{
			let table = <HTMLTableElement> d3.select(".breakpoints").select("table")[0][0];
			if (!table) return;
			newBreakpointRow(table, { enabled: true, location: "memory.bf(3)", condition: "", onHit: "" });
			newBreakpointRow(table, { enabled: true, location: "memory.bf:4", condition: "", onHit: "" });

			setInterval(()=>{
				manageSingleBlankBreakpoint(table);
				let newBreakpoints = getTableBreakpoints(table);
				if (breakpointListsAreEqual(prevBreakpoints, newBreakpoints)) return;
				prevBreakpoints = newBreakpoints;

				let editorFileName = "memory.bf"; // XXX
				let list : Editor.LineBreakpoint[] = [];
				let byLine : Editor.LineBreakpoint[] = [];

				newBreakpoints.forEach(b => {
					let m = reFileLine.exec(b.location||"");
					if (!m) return;
					let file = m[1];
					let line = parseInt(m[2] || m[3]);
					if (file != editorFileName) return;
					let bp = byLine[line];
					if (!bp) {
						bp = byLine[line] = { line: line, enabled: false };
						list.push(bp);
					}
					if (b.enabled) bp.enabled = true;
				});

				Editor.setLineBreakpoints(list);
			}, 10);
		});
	}
}
