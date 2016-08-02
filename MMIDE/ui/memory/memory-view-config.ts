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
			dataChangedDisplay	: DataChangedDisplay;
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
				dataChangedDisplay	: DataChangedDisplay[string("changedDisplay")],
			};
		}
	}
}
