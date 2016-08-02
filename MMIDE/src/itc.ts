// Intra-tab communications
module ITC {
	const log = (m, ...a) => {};
	//const log = (m, ...a) => console.log(m, ...a);
	const htmlRefresh = 100;
	const noShortcut = true;



	export interface AgingHeader {
		_itc_last_updated? : number; // ~ Date.now()
	}

	// TODO: Make culling automatic on sendToByClassName and listenToByClassName to reduce the chance of accidental leaks
	export function peekAndCullAll<Header extends AgingHeader>(prefix: string) : Header[] {
		let now = Date.now();
		let headers = [];

		for (let i=0; i<localStorage.length; ++i) {
			let key = localStorage.key(i);
			let matchesPrefix = key.substr(0,prefix.length) == prefix;
			if (matchesPrefix) {
				let header = <Header>JSON.parse(localStorage.getItem(key));
				if (Math.abs(header._itc_last_updated-now) > 3000) {
					localStorage.removeItem(key); // Timeout
					log(key, "timed out and removed");
				} else {
					headers.push(header);
				}
			}
		}

		return headers;
	}

	export function sendTo<Header extends AgingHeader>(key: string, header: Header) {
		header._itc_last_updated = Date.now();
		let local = localOnHeader[key];
		if (local) local(header);
		if (!local || noShortcut) localStorage.setItem(key, JSON.stringify(header));
	}

	export function listenTo<Header extends AgingHeader>(key: string, onHeader: (header: Header) => void) {
		localOnHeader[key] = onHeader;
	}

	export function sendToByClassName<Header extends AgingHeader>(className: string, keyPrefix: string, eachElement: (args: {itcKey: string, element: HTMLElement}) => Header) {
		let elements = getElementsByClassName(className);
		elements.forEach(e => {
			let itcKey = getItcKey(e);
			sendTo<Header>(keyPrefix+itcKey, eachElement({itcKey: itcKey, element: e}));
		});
	}

	export function listenToByClassName<Header extends AgingHeader>(className: string, keyPrefix: string, onHeader: (args: {header: Header, element: HTMLElement}) => void) {
		var listening : HTMLElement[] = [];
		let update = () => {
			let m = {};
			let elements = getElementsByClassName(className);
			elements.forEach(e => {
				let itcKey = getItcKey(e);
				m[itcKey] = true;
				listenTo<Header>(keyPrefix+itcKey, h => onHeader({header: h, element: e}));
			});
			listening.forEach(e => {
				let itcKey = getItcKey(e);
				if (!m[itcKey]) delete localOnHeader[keyPrefix+itcKey];
			});
			listening = elements;
		};
		update();
		setInterval(update, htmlRefresh);
	}

	let localOnHeader : {[id: string]: (header: AgingHeader) => void} = {};

	function getItcKey(e: HTMLElement): string {
		let a = <any>e;
		let key = a["__itc_key__"];
		if (key) return key;
		key = a["__itc_key__"] = Math.random().toString(36).substr(2,5);
		return key;
	}

	function getElementsByClassName(className: string) {
		let a : HTMLElement[] = [];
		let els = document.getElementsByClassName(className);
		for (let i=0; i<els.length; ++i) a.push(<HTMLElement>els.item(i));
		return a;
	}

	addEventListener("storage", ev => {
		let local = localOnHeader[ev.key];
		if (!local) return;
		local(<AgingHeader>JSON.parse(ev.newValue));
	});
}
