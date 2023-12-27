export function commentsParser(input: string) {
	const splitByCommas = input.split(',');
	// break up paranetheticals into separate strings and extract their contents
	const splitByParens = splitByCommas
		.map((section) => section.split(/\(([^)]+)\)/g))
		.flat();
	const comments = splitByParens.map((str) => {
		if (str.includes('(')) {
			return str.trim().slice(1, -1);
		}
		return str.trim();
	});
	return comments.filter((c) => c.length > 0);
}

/**
 * Extracts parentheticals from a string and removes
 * them, returning the string without the parentheticals
 * as "remaining" and a list of parenthesis contents
 * as "matched"
 */
export function extractParentheticals(input: string) {
	const splitByParens = input.split(/\(([^)]+)\)/g);
	const matched = splitByParens.filter((_, i) => i % 2 === 1);
	const remaining = splitByParens.filter((_, i) => i % 2 === 0).join('');
	return { matched, remaining };
}
