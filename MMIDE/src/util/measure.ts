function measure<F extends (...args) => any>(callback: F, label: string): F {
	let wrapped = function (...args) {
		let s = Date.now();
		let r = callback.call(this, ...args);
		let e = Date.now()-s;
		console.log(label,"took",e,"ms");
		return r;
	};
	return <F>wrapped;
}
