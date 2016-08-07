function debounce<F extends (...args) => void>(callback: F, waitMS: number): F {
	var callNext : F = undefined;

	let wrapped = (...args) => {
		if (callNext === undefined) {
			setTimeout(()=>{
				callNext.call(this, ...args);
				callNext = undefined;
			}, waitMS);
		}
		callNext = callback;
	};
	return <F>wrapped;
}
