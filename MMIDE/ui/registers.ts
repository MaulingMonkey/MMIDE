module UI {
	export module Registers {
		export function update(registers: [string, string][]) {
			let flat = "";
			let lpad = "      ";
			let rpad = "      ";
			registers.forEach(reg => flat += reg[0] + lpad.substring(reg[0].length) + " := " + rpad.substring(reg[1].length) + reg[1] + "\n");
			flat = flat.substr(0, flat.length-1);

			let els = document.getElementsByClassName("registers");
			for (let elI=0; elI<els.length; ++elI) {
				let el = <HTMLElement> els.item(elI);
				el.textContent = flat;
			}
		}
	}
}
