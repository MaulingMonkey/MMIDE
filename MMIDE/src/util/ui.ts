let _ui_document = this["document"];

module UI {
	export function byClassName(className: string): HTMLElement[] {
		if (!_ui_document) return []; // Webworker context

		let e : HTMLElement[] = [];
		let els = document.getElementsByClassName(className);
		for (let i=0; i<els.length; ++i) e.push(<HTMLElement>els.item(i));
		return e;
	}

	export function byId(elementId: string): HTMLElement {
		if (!_ui_document) return null; // Webworker context

		let e = document.getElementById(elementId);
		return e;
	}
}
