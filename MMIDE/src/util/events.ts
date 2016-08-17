declare function addEventListener(type: "lateLoaded", listener: (ev: CustomEvent) => any, useCapture?: boolean): void;

addEventListener("load", function(){
	// 5 seconds after load, trigger "lateLoaded"
	setTimeout(function(){
		dispatchEvent(new CustomEvent("lateLoaded"));
	}, 2000);
});
