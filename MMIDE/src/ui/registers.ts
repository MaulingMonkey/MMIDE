module UI {
	export module Registers {
		//const log = (m,...a) => console.log(m,...a);
		const log = (m,...a) => {};

		export function update(localDebugger: Debugger) {
			if (!localDebugger) return;
			let registers = localDebugger.threads()[0].registers();
			if (!registers) return;

			let msg : RegistersUpdate = { registers: registers };
			log("Sending registers...");
			ITC.sendTo("mmide-registers", msg);
		}

		interface RegistersUpdate extends ITC.AgingHeader {
			registers: [string,string][];
		}

		ITC.listenTo<RegistersUpdate>("mmide-registers", update => {
			log("Recieving registers...");
			let els = byClassName("registers");
			if (!els) return;

			log("Elements to update...");
			let registers = update.registers;
			let flat = "";
			let lpad = "";
			let rpad = "                 ";
			registers.forEach(reg => {
				if (!reg[1]) flat += reg[0] + "\n";
				else         flat += reg[0] + lpad.substring(reg[0].length) + " := " + rpad.substring(reg[1].length) + reg[1] + "\n";
			});
			flat = flat.substr(0, flat.length-1);

			els.forEach(el => el.textContent = flat);
		});
	}
}
