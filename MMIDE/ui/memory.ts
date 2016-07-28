module UI {
	export module Memory {
		export function update(theDebugger: Debugger) {
			let els = document.getElementsByClassName("memory");
			for (let elI=0; elI<els.length; ++elI) {
				var el = <HTMLElement> els.item(elI);

				let b = (k: string) => { let value = el.dataset[k]; console.assert(value !== undefined); return value === "1" || value === "true"; };
				let i = (k: string) => { let value = parseInt(el.dataset[k]); console.assert(value !== undefined && !isNaN(value) && isFinite(value)); return value; }

				var address				= i("address");
				var colSize				= i("colSize");
				var cols				= i("cols");
				var rows				= i("rows");
				var showLittleEndian	= b("littleEndian");
				var showAddress			= b("showAddress");
				var showHex				= b("showHex");
				var showData			= b("showData");

				//console.log(colSize, cols, rows, showHex, showData);

				var memory = theDebugger === undefined ? [] : theDebugger.memory();
				let getByte = (row: number, col: number, byte: number, littleEndian: boolean) => memory[address + (littleEndian ? colSize - byte - 1 : byte) + colSize * (col + cols * row)] || 0; // TODO: Fix endian calc

				let fullBuf = "";
				for (let rowI=0; rowI < rows; ++rowI) {
					let lineBuf = rowI === 0 ? "" : "\n";

					if (showAddress) {
						let a = (address + colSize * cols * rowI).toString(16);
						let pad = "0x00000000";
						lineBuf += pad.substr(0, pad.length-a.length) + a + "    ";
					}

					if (showHex) {
						for (let colI=0; colI < cols; ++colI) {
							if (colI != 0) lineBuf += " ";

							for (let byteI=0; byteI<colSize; ++byteI) {
								let v = getByte(rowI, colI, byteI, showLittleEndian);
								var sv = v.toString(16);
								if (sv.length == 1) lineBuf += "0";
								lineBuf += sv;
							}
						}
						lineBuf += "    ";
					}

					if (showData) for (let colI=0; colI < cols; ++colI) {
						let offset = colSize * (colI + (cols * rowI));
						for (let byteI=0; byteI<colSize; ++byteI) {
							let v = getByte(rowI, colI, byteI, false);
							var sv = (32 <= v && v < 127) ? String.fromCharCode(v) : "."; // XXX: Abuse unicode? 127 = DEL, probably bad.  
							lineBuf += sv;
						}
					}

					fullBuf += lineBuf;
					//if (rowI === 0) console.log(lineBuf);
				}
				el.textContent = fullBuf;
			}
		}
	}
}
