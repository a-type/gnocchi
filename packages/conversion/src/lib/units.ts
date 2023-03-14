import configureMeasurements, {
	length,
	mass,
	pieces,
	UnitDescription,
	volume,
} from 'convert-units';

export const convert = configureMeasurements({
	volume,
	mass,
	pieces,
	length,
});

export function lookupUnit(unitName: string | null): UnitDescription | null {
	if (!unitName) return null;
	const units = convert().list();
	const match = units.find(function ({ abbr, singular }: any) {
		return (
			unitName.toLowerCase() === abbr ||
			unitName.toLowerCase() === singular.toLowerCase()
		);
	});
	return match || null;
}

export const knownUnitSingulars = [
	'cup',
	'ounce',
	'pound',
	'quart',
	'tablespoon',
	'teaspoon',
	'pint',
	'gallon',
	'liter',
	'milliliter',
	'gram',
	'kilogram',
	'milligram',
	// non-measurement units
	'can',
	'clove',
	'slice',
	'package',
	'stalk',
	'stick',
	'box',
	'jar',
	'container',
	'bag',
	'bottle',
	'bunch',
	'bundle',
	'pack',
	'pinch',
	'dash',
	'splash',
	'bushel',
	'handful',
	'loaf',
	'head',
	'carton',
];
