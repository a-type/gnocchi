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
	const match = units.find(function ({ abbr, singular, plural }) {
		return (
			unitName.toLowerCase() === abbr ||
			unitName.toLowerCase() === singular.toLowerCase() ||
			unitName.toLowerCase() === plural.toLowerCase()
		);
	});
	return match || null;
}
