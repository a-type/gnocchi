import pluralize from 'pluralize';

pluralize.addIrregularRule('slice', 'slices');

export function depluralize(text: string) {
	if (text.endsWith("'s")) return text;
	return pluralize.singular(text);
}
