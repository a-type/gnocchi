import { depluralize } from './depluralize.js';
import { articles, unitAbbreviations } from './lists.js';

export function unitParser(rawInput: string) {
	let input = normalizeInput(rawInput);

	// expand known abbreviations
	const matchingAbbreviation = unitAbbreviations.find(([abbreviation]) => {
		if (
			input.trim() === abbreviation ||
			depluralize(input.trim()) === abbreviation
		)
			return true;
		return false;
	});

	if (matchingAbbreviation) {
		return matchingAbbreviation[1];
	}

	// discard leading or trailing articles
	let articleMatch = articles.find((a) => input.startsWith(a + ' '));
	if (articleMatch) {
		input = input.slice(articleMatch.length);
	}
	articleMatch = articles.find((a) => input.endsWith(' ' + a));
	if (articleMatch) {
		input = input.slice(0, -articleMatch.length);
	}

	return input.trim();
}

function normalizeInput(input: string) {
	// remove any trailing punctuation
	return input.replace(/[\.,;:]$/, '');
}
