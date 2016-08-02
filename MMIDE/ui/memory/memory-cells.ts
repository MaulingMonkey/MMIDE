module UI {
	export module Memory {
		export interface Cell {
			type:		string; // e.g. memory-cell-address
			display:	string; // e.g. "....."
			data:		string; // e.g. "\x01\x04\x02.."
		}

		export function collectTableCells(config: MemoryViewConfig, memoryBaseAddress: number, memory: number[]): Cell[][] {
			var table : Cell[][] = [];
			for (let rowI = 0; rowI < config.rows; ++rowI) {
				let row : Cell[] = [];
				if (config.showAddress)	appendAddressCell	(row, config, rowI, memoryBaseAddress);
				if (config.showHex)		appendHexCells		(row, config, rowI, memory);
				if (config.showData)	appendDataCells		(row, config, rowI, memory);
				table.push(row);
			}
			return table;
		}

		function appendAddressCell(rowCells: Cell[], config: MemoryViewConfig, rowI: number, memoryBaseAddress: number) {
			if (config.showAddress) {
				let a = (memoryBaseAddress + config.colSize * config.cols * rowI).toString(16);
				let pad = "0x00000000";
				rowCells.push({type: "memory-cell-address", display: pad.substr(0, pad.length-a.length) + a, data: a});
			}
		}

		function appendHexCells(rowCells: Cell[], config: MemoryViewConfig, rowI: number, memory: number[]) {
			for (let colI=0; colI < config.cols; ++colI) {
				let cellText = "";
				for (let byteI=0; byteI<config.colSize; ++byteI) {
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
			for (let colI=0; colI < config.cols; ++colI) {
				let offset = config.colSize * (colI + (config.cols * rowI));
				for (let byteI=0; byteI<config.colSize; ++byteI) {
					let v = getByte(memory, config, rowI, colI, byteI, false);
					let cellText = (32 <= v && v < 127) ? String.fromCharCode(v) : "."; // XXX: Abuse unicode? 127 = DEL, probably bad.
					let cellData = String.fromCharCode(v);
					rowCells.push({type: "memory-cell-data", display: cellText, data: cellData});
				}
			}
		}

		function getByte(memory: number[], config: MemoryViewConfig, rowI: number, colI: number, byteI: number, littleEndian: boolean) {
			// NOTE WELL: We now assume "memory" comes to us pre-sliced such that memory[0] ~ config.baseAddress (or more accurately, memoryBaseAddress and we lag behind maybe)
			// We could try starting at config.baseAddress - lastUpdateMemoryBaseAddress or some shit but how about no.
			return memory[(littleEndian ? config.colSize - byteI - 1 : byteI) + config.colSize * (colI + config.cols * rowI)] || 0;
		}
	}
}
