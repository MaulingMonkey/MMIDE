module UI {
	export module Memory {
		//		Possible optimizations:
		// Only send changed bytes?
		// Send data as string instead of number[]?

		interface ListenNotice extends ITC.AgingHeader {
			baseAddress	: number;
			size		: number;
			responseKey	: string; // random
		}

		interface UpdateNotice extends ITC.AgingHeader {
			baseAddress	: number;
			data		: number[];
		}

		const updatePrefix   = "mmide-memory-update-";
		const listenerPrefix = "mmide-memory-listener-";

		function getListeners(): ListenNotice[] { return ITC.peekAll<ListenNotice>(listenerPrefix); }
		function getUpdates():   UpdateNotice[] { return ITC.peekAll<UpdateNotice>(updatePrefix); }

		// Local update of memory
		export function update(localDebugger: Debugger) {
			if (!localDebugger) return;

			getUpdates(); // Just clear old responses
			getListeners().forEach(req => {
				let response : UpdateNotice = {
					baseAddress:	req.baseAddress,
					data:			localDebugger.memory(req.baseAddress, req.size),
				};
				ITC.sendTo(req.responseKey, response);
			});
		}

		// Ensure we recieve remote updates of memory
		function sendUpdateRequest() {
			ITC.sendToByClassName("memory", listenerPrefix, args => {
				let config = getMemoryViewConfig(args.element);
				let listenNotice : ListenNotice = {
					baseAddress:	config.baseAddress,
					size:			config.cols * config.rows * config.colSize,
					responseKey:	updatePrefix + args.itcKey,
				};
				return listenNotice;
			});
		}

		addEventListener("load", ev => {
			// Remote update of memory
			ITC.listenToByClassName<UpdateNotice>("memory", updatePrefix, ev => {
				var config = getMemoryViewConfig(ev.element);
				var table = collectTableCells(config, ev.header.baseAddress, ev.header.data);
				updateTable(ev.element, config, table);
			});
			sendUpdateRequest();
			setInterval(sendUpdateRequest, 1000); // Keepalive
		});
	}
}
