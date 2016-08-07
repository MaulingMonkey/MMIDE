module UI {
	export module Output {
		const maxCol = 180;

		interface OutputState extends ITC.AgingHeader {
			buffer: string;
		}

		export class NamedOutput {
			private className:	string;
			private itcKey:		string;

			// NOTE WELL:  Assumes output is written to locally exclusively.
			private col:		number;
			private buffer:		string;
			private lineBuffer:	string;
			private dirty:		boolean;
			private animated:	boolean;

			public constructor(postfix: string) {
				let className	= this.className	= "output-"+postfix;
				let itcKey		= this.itcKey		= "mmide-output-"+postfix;
				this.col		= 0;
				this.buffer		= "";
				this.lineBuffer	= "";
				this.dirty		= false;
				this.animated	= false;

				ITC.listenTo<OutputState>(itcKey, ev => byClassName(className).forEach(el => {
					//let s = Date.now();
					el.textContent = ev.buffer;
					//console.log(Date.now()-s,"ms to update output");
				}));
			}

			private doSend() {
				let nextEol = this.lineBuffer.indexOf("\n");

				while (nextEol != -1) {
					while (nextEol > maxCol) {
						this.buffer += this.lineBuffer.substr(0, maxCol) + "\n";
						this.lineBuffer = this.lineBuffer.substr(maxCol);
						nextEol -= maxCol;
					}
					this.buffer += this.lineBuffer.substr(0, nextEol) + "\n";
					this.lineBuffer = this.lineBuffer.substr(nextEol+1);
					nextEol = this.lineBuffer.indexOf("\n");
				}

				while (this.lineBuffer.length > maxCol) {
					this.buffer += this.lineBuffer.substr(0, maxCol) + "\n";
					this.lineBuffer = this.lineBuffer.substr(maxCol);
				}

				ITC.sendTo<OutputState>(this.itcKey, { buffer: this.buffer + this.lineBuffer });
			}

			private perFrame() {
				requestAnimationFrame(() => this.perFrame());
				if (this.dirty) this.doSend();
				this.dirty = false;
			}

			private kickoffSend() {
				this.dirty = true;
				if (this.animated) return;
				this.animated = true;
				requestAnimationFrame(() => this.perFrame());
				setInterval(()=>this.kickoffSend(), 1000);
			}

			public clear() {
				this.buffer = this.lineBuffer = "";
				this.kickoffSend();
			}

			public write(data: string) {
				if (this.buffer.length + this.lineBuffer.length >= 1000000) return;

				this.lineBuffer += data;
				this.kickoffSend();
			}
		}

		function lazyishNamedOutput(id: string): () => NamedOutput {
			var no : NamedOutput = undefined;
			let callback = () => { if (!no) no = new NamedOutput(id); return no; };
			addEventListener("load", callback);
			return callback;
		}

		export const stdio = lazyishNamedOutput("stdio");
	}
}
