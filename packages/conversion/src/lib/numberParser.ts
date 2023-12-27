import { numberWords } from './lists.js';

export function numberParser(input: string) {
	const groups = splitNumberGroups(input);
	// special case : compound fraction
	if (groups.length === 2 && groups[0] >= 1 && groups[1] < 1) {
		return groups[0] + groups[1];
	}
	return groups.reduce((acc, group) => {
		return acc * group;
	}, 1);
}

function splitNumberGroups(source: string) {
	const numberGroups: number[] = [];
	let remaining = source;
	while (remaining) {
		const nextGroup = identifyLeadingNumberGroup(remaining);
		if (nextGroup) {
			numberGroups.push(nextGroup[0]);
			remaining = nextGroup[1];
		} else {
			break;
		}
	}

	return numberGroups;
}

function identifyLeadingNumberGroup(source: string): [number, string] | null {
	const trimmedSource = source.trim();
	// lookahead for a known word
	const knownWord = numberWords.find(([word]) =>
		trimmedSource.match(new RegExp(`^${word}`)),
	);
	if (knownWord) {
		return [knownWord[1], trimmedSource.slice(knownWord[0].length)];
	}

	// lookeahead for a fraction structure
	const leadingFractionMatch = /^\d+\s?\/\s?\d+/.exec(trimmedSource);
	if (leadingFractionMatch) {
		const [num, denom] = leadingFractionMatch[0].split('/').map(Number);
		return [num / denom, trimmedSource.slice(leadingFractionMatch[0].length)];
	}

	// lookahead for a range: 1-2, 1 or 2, 1 to 2
	let leadingRangeMatch = /^\d+\s?-\s?\d+/.exec(trimmedSource);
	if (leadingRangeMatch) {
		const [start, end] = leadingRangeMatch[0].split('-').map(Number);
		// always use the larger number
		return [
			Math.max(start, end),
			trimmedSource.slice(leadingRangeMatch[0].length),
		];
	} else {
		leadingRangeMatch = /^\d+\s?(?:or|to)\s?\d+/.exec(trimmedSource);
		if (leadingRangeMatch) {
			const [start, end] = leadingRangeMatch[0].split(/(?:or|to)/).map(Number);
			// always use the larger number
			return [
				Math.max(start, end),
				trimmedSource.slice(leadingRangeMatch[0].length),
			];
		}
	}

	// lookahead for any number
	const leadingDigitsMatch = /[\d\.]+/.exec(trimmedSource);
	if (leadingDigitsMatch) {
		return [
			parseFloat(leadingDigitsMatch[0]),
			trimmedSource.slice(leadingDigitsMatch[0].length),
		];
	}

	return null;
}
