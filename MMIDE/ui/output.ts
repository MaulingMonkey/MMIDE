module UI {
	export class Output {
		_element:	Element;
		_col:		number;

		public constructor(element: Element) {
			this._element	= element;
			this._col		= 0;
		}

		public write(data: string) {
			//let maxCol = 120; // TODO: Replace with this.element data?
			let maxCol = 180; // TODO: Replace with this.element data?
			let col = this._col;

			data = data.replace("\r",""); // only care about \n

			let i = 0;
			let buf = "";
			while (i < data.length) {
				let nextSplit = data.indexOf("\n", i);
				if (nextSplit === -1) nextSplit = data.length;

				while (i < nextSplit) {
					console.assert(col <= maxCol-1);
					let append = data.substr(i, Math.min(nextSplit-i, maxCol-col));
					console.assert(append.length >= 1);
					buf += append;
					col += append.length;
					i   += append.length;
					if (col == maxCol) {
						buf += "\n";
						col = 0;
					}
				}

				if (nextSplit < data.length) {
					buf += "\n";
					col = 0;
				}

				console.assert(i === nextSplit);
				i = nextSplit+1; // skip EOL
			}

			this._element.textContent += buf;
			this._col = col;
		}

		public clear() {
			this._element.textContent = "";
			this._col = 0;
		}

		static _outputs : Output[] = [];

		static outputs(): Output[] {
			let outputElements = [];
			let _outputElements = document.getElementsByClassName("output");
			for (let i=0; i<_outputElements.length; ++i) outputElements.push(_outputElements.item(i));

			outputElements.forEach(e => {
				if (!Output._outputs.some(o => o._element === e)) {
					Output._outputs.push(new Output(e));
				}
			});

			Output._outputs = Output._outputs.filter(o => outputElements.indexOf(o._element) !== -1);
			return Output._outputs;
		}
	};
}
