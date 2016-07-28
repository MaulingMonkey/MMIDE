// TODO: Flesh this out more based on https://ace.c9.io/#nav=api

declare namespace ace {
	type TextMode = any; // ???
	type Object = any; // ???

	export function creadEditSession(text: Document | string, mode: TextMode): Document;
	export function edit(el: string | HTMLElement): Editor;
	export function require(moduleName: string): Object;

	interface Document {
		// ...
	}

	interface Editor {
		getValue(): string;
		setValue(value: string);
		setTheme(theme: string);
		getSession(): EditSession;
		resize(force?: boolean);
		// ...
	}

	type EditSession = any; // ???
}
