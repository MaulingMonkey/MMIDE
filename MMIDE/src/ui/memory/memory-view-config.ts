module UI {
	export module Memory {
		export enum DataChangedDisplay {
			None,
			DelayHighlight,
			DurationHighlight,
		}

		export interface MemoryViewConfig {
			baseAddress			: number;
			colSize				: number;
			cols				: number;
			rows				: number;
			showLittleEndian	: boolean;
			showAddress			: boolean;
			showHex				: boolean;
			showData			: boolean;
			forceChangedDisplay	: boolean;
			dataChangedDisplay	: DataChangedDisplay;
		}

		export function isDataChangedDisplayOK(): boolean {
			// Chrome (FAST):	navigator.userAgent == "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
			// IE 11 (SLOW):	navigator.userAgent == "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko"
			return true;
		}

		export function getMemoryViewConfig(el: HTMLElement): MemoryViewConfig {
			let bool	= (k: string) => { let value = el.dataset[k];			console.assert(value !== undefined && value !== null);										return value === "1" || value === "true"; };
			let string	= (k: string) => { let value = el.dataset[k];			console.assert(value !== undefined && value !== null);										return value; }
			let int		= (k: string) => { let value = parseInt(el.dataset[k]);	console.assert(value !== undefined && value !== null && !isNaN(value) && isFinite(value));	return value; }

			return {
				baseAddress			: int("address"),
				colSize				: int("colSize"),
				cols				: int("cols"),
				rows				: int("rows"),
				showLittleEndian	: bool("littleEndian"),
				showAddress			: bool("showAddress"),
				showHex				: bool("showHex"),
				showData			: bool("showData"),
				forceChangedDisplay	: bool("forceChangedDisplay"),
				dataChangedDisplay	: DataChangedDisplay[string("changedDisplay")],
			};
		}
	}
}
