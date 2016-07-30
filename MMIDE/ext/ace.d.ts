// TODO: Flesh this out more based on https://ace.c9.io/#nav=api

declare namespace ace {
	type TextMode = any; // ???
	type Object = any; // ???
	type UndoManager = any;

	export function creadEditSession(text: Document | string, mode: TextMode): Document;
	export function edit(el: string | HTMLElement): Editor;
	export function require(moduleName: string): Object;

	type Position = { row: number, column: number };

	// ----------------------------------------------------------------------------------------------------
	// https://ace.c9.io/#nav=api&api=document
	// https://github.com/ajaxorg/ace/blob/master/lib/ace/document.js
	// ----------------------------------------------------------------------------------------------------
	export class Document {
		// Constructors
		constructor(text: string | string[]);

		// Events
		on(event: string,		callback: (...args) => any);
		on(event: "change",		callback: (e: DocumentChangeEvent) => void);

		// Methods
		applyDeltas(deltas: Object);
		createAnchor(row: number, column: number);
		getAllLines(): string[];
		getLength(): number;
		getLine(row: number);
		getLines(firstRow: number, lastRow: number): string[];
		getNewLineCharacter(): string;
		getNewLineMode(): string; // windows | unix | auto
		getTextRange(range: Range);
		getValue(): string;
		indexToPosition(index: number, startRow: number): Position;
		insert(position: Position, text: string): Object;
		insertInLine(position: any, text: string): Object; // Very curious as to what the actual position arg is
		insertLines(row: number, lines: string[]): Object;
		insertNewLine(position: Position): Object;
		isNewLine(text: string): boolean;
		positionToIndex(pos: Position, startRow: number): number;
		removeEventListener(range: Range): Object;
		removeInLine(row: number, startColumn: number, endColumn: number): Object;
		removeLines(firstRow: number, lastRow: number): string;
		removeNewLine(row: number);
		replace(range: Range, text: string): Object;
		revertDeltas(deltas: Object);
		setNewLineMode(newLineMode: string);
		setValue(text: string);
	}
	type DocumentChangeEvent = {
		action:	string, // "insertLines", "insertText", "removeLines", or "removeText"
		range:	Range,
		lines?:	number[],	// SWAG @ type
		text?:	string,		// SWAG @ type
		nl?:	string,		// SWAG @ type
	};



	// ----------------------------------------------------------------------------------------------------
	// https://ace.c9.io/#nav=api&api=editor
	// ----------------------------------------------------------------------------------------------------
	interface Editor {
		getValue(): string;
		setValue(value: string);
		setTheme(theme: string);
		getSession(): EditSession;
		resize(force?: boolean);
		// ...
	}


	// ----------------------------------------------------------------------------------------------------
	// https://ace.c9.io/#nav=api&api=edit_session
	// https://github.com/ajaxorg/ace/blob/master/lib/ace/edit_session.js
	// ----------------------------------------------------------------------------------------------------
	export class EditSession {
		// Constructors
		constructor(text: Document|string, mode: TextMode);

		// Events
		on(event: string,				callback: (...args) => any);
		on(event: "change",				callback: (e: {delta: any}) => void);
		on(event: "changeAnnotation",	callback: () => void);
		on(event: "changeBackMarker",	callback: () => void);
		on(event: "changeBreakpoint",	callback: () => void);
		on(event: "changeFold",			callback: () => void);
		on(event: "changeFrontMarker",	callback: () => void);
		on(event: "changeMode",			callback: () => void);
		on(event: "changeOverwrite",	callback: () => void);
		on(event: "changeScrollLeft",	callback: (scrollLeft: number) => void);
		on(event: "changeScrollTop",	callback: (scrollTop: number) => void);
		on(event: "changeTabSize",		callback: () => void);
		on(event: "changeWrapLimit",	callback: () => void);
		on(event: "changeWrapMode",		callback: () => void);
		on(event: "tokenizerUpdate",	callback: (e: {data: any}) => void);

		addDynamicMarker(marker: {update: any}, inFront: boolean): {update: any, id: number, inFront: boolean};
		addGutterDecoration(row: number, className: string): void;
		addMarker(range: Range, clazz: string, type: string | Function, inFront: boolean): number;
		clearAnnotations(): void;
		clearBreakpoint(row: number): void;
		clearBreakpoints(): void;
		documentToScreenColumn(row: number, docColumn: number): number;
		documentToScreenPosition(docRow: number, docColumn: number): Position;
		documentToScreenRow(docRow: number, docColumn: number): number;
		duplicateLines(firstRow: number, lastRow: number): number;
		getAnnotations(): Annotation[];
		getAWordRange(row: number, column: number): Range;
		getBreakpoints(): string[]; // XXX: Doc annotation lied!
		getDocument(): Document;
		getDocumentLastRowColumn(docRow: number, docColumn: number): number;
		getDocumentLastRowColumnPosition(docRow: number, docColumn: number): Position;
		getLength(): number;
		getLine(row: number): string;
		getLines(firstRow: number, lastRow: number): string[];
		getMarkers(inFront: boolean): number[];
		getMode(): TextMode;
		getNewLineMode(): string;
		getOverwrite(): boolean;
		getRowLength(row: number): number;
		getRowSplitData(row: Object): string;
		getScreenLastRowColumn(screenRow: number): number;
		getScreenLength(): number;
		getScreenTabSize(screenColumn: number): number;
		getScreenWidth(): number;
		getScrollLeft(): number;
		getScrollTop(): number;
		getSelection(): any;
		getState(row: number): any;
		getTabSize(): number;
		getTabString(): string;
		getTextRange(range: Range): string;
		getTokenAt(row: number, column: number): any;
		getTokens(row: number);
		getUndoManager(): UndoManager;
		getUseSoftTabs(): boolean;
		getUseWorker(): boolean;
		getUseWrapMode(): boolean;
		getValue(): string;
		getWordRange(row: number, column: number): Range;
		getWrapLimit(): number;
		getWrapLimitRange(): { min: number, max: number };
		//highlight(); // Undocumented
		//highlightLines(); // Undocumented
		indentRows(startRow: number, endRow: number, indentString: string): any;
		insert(position: Position, text: string): Object;
		isTabStop(position: Object): boolean;
		moveLinesDown(firstRow: number, lastRow: number): number;
		moveLinesUp(firstRow: number, lastRow: number): number;
		moveText(fromRange: Range, toPosition: Position): Range;
		//onChange(); // Undocumented
		//onChangeFold(); // Undocumented
		onReloadTokenizer(e: Object);
		outdentRows(range: Range);
		//redo(); // Undocumented
		redoChanges(deltas: any[], dontSelect: boolean);
		remove(range: Range): Object;
		removeGutterDecoration(row: number, className: string);
		removeMarker(markerId: number);
		replace(range: Range, text: string): Object;
		//reset(); // Undocumented
		//resetCaches(); // Undocumented
		//screenToDocumentColumn(); // Undocumented
		screenToDocumentPosition(screenRow: number, screenColumn: number): Position;
		//screenToDocumentRow(); // Undocumented
		setAnnotations(annotations: Annotation[]);
		setBreakpoint(row: number, className: string);
		setBreakpoints(rows: number[]);
		setDocument(doc: Document);
		//setMode(); // Undocumented
		setNewLineMode(newLineMode: string);
		setOverwrite(overwrite: boolean);
		setScrollLeft(scrollLeft: Object);
		setScrollTop(scrollTop: number);
		setTabSize(tabSize: number);
		setUndoManager(undoManager: UndoManager);
		setUndoSelect(enable: boolean);
		setUseSoftTabs(useSoftTabs: boolean);
		setUseWorker(useWorker: boolean);
		setUseWrapMode(useWrapMode: boolean);
		setValue(text: string);
		setWrapLimitRange(min: number, max: number);
		toggleOverwrite();
		toString(): string;
		//undo(); // Undocumented
		undoChanges(deltas: any[], dontSelect: boolean): Range;
	}
	// See "Error:" example in edit_session.js, immediately above setAnnotations
	interface Annotation {
		row:		number,
		column?:	number, // optional
		text:		string,
		type:		string, // "error", "warning", or "info"
	}



	// ----------------------------------------------------------------------------------------------------
	// https://ace.c9.io/#nav=api&api=range
	// ----------------------------------------------------------------------------------------------------
	export class Range {
		// Constructors
		constructor(startRow: number, startColumn: number, endRow: number, endColumn: number);

		// Methods
		clipRows(firstRow: number, lastRow: number): Range;
		clone(): Range;
		collapseRows(): Range;
		compare(row: number, column: number): number;
		compareEnd(row: number, column: number): number;
		compareInside(row: number, column: number);
		comparePoint(p: any): number; // XXX: Suspect docs lie about p=Range
		compareRange(range: Range): number;
		compareStart(row: number, column: number): number;
		contains(row: number, column: number): boolean;
		containsRange(range: Range): boolean;
		extend(row: number, column: number): Range;
		fromPoints(start: any, end: any): Range; // XXX: Suspect docs lie about start/end=Range
		inside(row: number, column: number): boolean;
		insideEnd(row: number, column: number): boolean;
		insideStart(row: number, column: number): boolean;
		intersects(range: Range): boolean;
		//isEmpty(): boolean; // Undocumented
		isEnd(row: number, column: number): boolean;
		isEqual(range: Range): boolean;
		isMultiLine(): boolean;
		isStart(row: number, column: number): boolean;
		setEnd(row: number, column: number);
		setStart(row: number, column: number);
		toScreenRange(session: EditSession): Range;
		toString(): string;
	}



	// ----------------------------------------------------------------------------------------------------
	// https://github.com/ajaxorg/ace/blob/master/lib/ace/tooltip.js
	// ----------------------------------------------------------------------------------------------------
	export class Tooltip {
		constructor(parentNode: HTMLElement);
		init();
		getElement(): HTMLElement;
		setText(text: string);
		setHtml(html: string);
		setPosition(x: number, y: number);
		setClassName(className: string);
		show(text: string, x: number, y: number);
		hide();
		getHeight(): number;
		getWidth(): number;
	}

}
