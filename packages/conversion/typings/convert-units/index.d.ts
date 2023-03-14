declare module 'convert-units' {
	type ConvertFrom = {
		to: (to: string) => number;
		toBest(): ConvertResult;
		possibilities: (measure?: string) => string[];
	};
	function convert(value?: number): {
		from: (from: string) => ConvertFrom;
		list: (measure?: string) => UnitDescription[];
	};
	const configureMeasurements = (measurements: any) => convert;

	export default configureMeasurements;

	export const length = any;
	export const mass = any;
	export const pieces = any;
	export type ConvertResult = {
		val: number;
		unit: string;
		plural: string;
	};
	export type UnitDescription = {
		abbr: string;
		measure: string;
		system: string;
		singular: string;
		plural: string;
	};
	export const volume = any;
}
