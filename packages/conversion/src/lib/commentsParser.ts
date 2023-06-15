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
