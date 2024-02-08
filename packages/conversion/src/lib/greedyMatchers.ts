import { isAllAdjectives } from './adjectives.js';
import {
	articles,
	knownComments,
	knownUnitPlurals,
	numberWords,
	unitAbbreviationPlurals,
	unitAbbreviations,
	knownUnitSingulars,
} from './lists.js';

export function greedyMatchNumber(
	input: string,
	ctx: { runningText: string } = { runningText: '' },
): {
	matched: string;
	remaining: string;
} {
	if (!input) {
		return {
			matched: ctx.runningText,
			remaining: input,
		};
	}

	// comes before space so it can match leading space, which is important
	// to not accidentally match "to" in something like "tomato"
	const leadingRangeWordDelimiter = /^\s+(or|to)\s+/.exec(input);
	if (leadingRangeWordDelimiter) {
		ctx.runningText += leadingRangeWordDelimiter[0];
		return greedyMatchNumber(
			input.slice(leadingRangeWordDelimiter[0].length),
			ctx,
		);
	}

	const leadingSpaceMatch = /^\s+/.exec(input);
	if (leadingSpaceMatch) {
		ctx.runningText += leadingSpaceMatch[0];
		return greedyMatchNumber(input.slice(leadingSpaceMatch[0].length), ctx);
	}

	// lookahead for a known word
	const knownWord = numberWords.find(([word]) => input.startsWith(word + ' '));

	if (knownWord) {
		ctx.runningText += knownWord[0];
		return greedyMatchNumber(input.slice(knownWord[0].length), ctx);
	}

	const leadingDigitsMatch = /^\d+/.exec(input);
	if (leadingDigitsMatch) {
		ctx.runningText += leadingDigitsMatch[0];
		return greedyMatchNumber(input.slice(leadingDigitsMatch[0].length), ctx);
	}

	const leadingSlashMatch = /^\/\d+/.exec(input);
	if (leadingSlashMatch) {
		ctx.runningText += leadingSlashMatch[0];
		return greedyMatchNumber(input.slice(leadingSlashMatch[0].length), ctx);
	}

	const leadingDotMatch = /^\.\d+/.exec(input);
	if (leadingDotMatch) {
		ctx.runningText += leadingDotMatch[0];
		return greedyMatchNumber(input.slice(leadingDotMatch[0].length), ctx);
	}

	const leadingRangeDelimiter = /^-/.exec(input);
	if (leadingRangeDelimiter) {
		ctx.runningText += leadingRangeDelimiter[0];
		return greedyMatchNumber(input.slice(leadingRangeDelimiter[0].length), ctx);
	}

	return {
		matched: ctx.runningText,
		remaining: input,
	};
}

export function greedyMatchUnit(
	input: string,
	ctx: { runningText: string } = { runningText: '' },
): {
	matched: string;
	remaining: string;
} {
	if (!input) {
		return {
			matched: ctx.runningText,
			remaining: input,
		};
	}

	const leadingSpaceMatch = /^\s+/.exec(input);
	if (leadingSpaceMatch) {
		ctx.runningText += leadingSpaceMatch[0];
		return greedyMatchUnit(input.slice(leadingSpaceMatch[0].length), ctx);
	}

	// lookahead for a known word
	const knownWord = knownUnitSingulars.find((word) =>
		input.toLowerCase().startsWith(word + ' '),
	);

	if (knownWord) {
		ctx.runningText += knownWord;
		return greedyMatchUnit(input.slice(knownWord.length), ctx);
	}

	const knownWordPlural = knownUnitPlurals.find((word) =>
		input.toLowerCase().startsWith(word + ' '),
	);

	if (knownWordPlural) {
		ctx.runningText += knownWordPlural;
		return greedyMatchUnit(input.slice(knownWordPlural.length), ctx);
	}

	// first pass is case-specific,
	// second is not - so we can match 't' and 'T', etc
	let knownAbbreviation = [
		...unitAbbreviations,
		...unitAbbreviationPlurals,
	].find(
		([word]) => input.startsWith(word + ' ') || input.startsWith(word + '.'),
	);
	knownAbbreviation ||= [...unitAbbreviations, ...unitAbbreviationPlurals].find(
		([word]) =>
			input.toLowerCase().startsWith(word + ' ') ||
			input.toLowerCase().startsWith(word + '.'),
	);

	if (knownAbbreviation) {
		ctx.runningText += knownAbbreviation[0];
		return greedyMatchUnit(input.slice(knownAbbreviation[0].length), ctx);
	}

	const articleMatch = articles.find((a) => input.startsWith(a + ' '));
	if (articleMatch) {
		ctx.runningText += articleMatch;
		return greedyMatchUnit(input.slice(articleMatch.length), ctx);
	}

	// match but ignore trailing .
	const trailingDotMatch = /^\./.exec(input);
	if (trailingDotMatch) {
		ctx.runningText += trailingDotMatch[0];
		return greedyMatchUnit(input.slice(trailingDotMatch[0].length), ctx);
	}

	// if there's trailing space on the result,
	// 'give it back' to the original
	// TODO: expand to handle multiple spaces
	if (ctx.runningText.endsWith(' ')) {
		ctx.runningText = ctx.runningText.slice(0, -1);
		return {
			matched: ctx.runningText,
			remaining: ' ' + input,
		};
	}

	return {
		matched: ctx.runningText,
		remaining: input,
	};
}

export function greedyMatchOf(
	input: string,
	ctx: { runningText: string } = { runningText: '' },
): {
	matched: string;
	remaining: string;
} {
	if (!input) {
		return {
			matched: ctx.runningText,
			remaining: input,
		};
	}

	const leadingSpaceMatch = /^\s+/.exec(input);
	if (leadingSpaceMatch) {
		ctx.runningText += leadingSpaceMatch[0];
		return greedyMatchOf(input.slice(leadingSpaceMatch[0].length), ctx);
	}

	const knownWord = /^of\s+/.exec(input);
	if (knownWord) {
		ctx.runningText += knownWord[0];
		return greedyMatchOf(input.slice(knownWord[0].length), ctx);
	}

	return {
		matched: ctx.runningText,
		remaining: input,
	};
}

export function reverseGreedyMatchComment(
	input: string,
	ctx: { runningText: string } = { runningText: '' },
): {
	matched: string;
	remaining: string;
} {
	if (!input) {
		return {
			matched: ctx.runningText,
			remaining: input,
		};
	}

	const trailingSpaceMatch = /\s+$/.exec(input);
	if (trailingSpaceMatch) {
		ctx.runningText = trailingSpaceMatch[0] + ctx.runningText;
		return reverseGreedyMatchComment(
			input.slice(0, -trailingSpaceMatch[0].length),
			ctx,
		);
	}

	const knownComment = knownComments.find((comment) => input.endsWith(comment));
	if (knownComment) {
		ctx.runningText = knownComment + ctx.runningText;
		return reverseGreedyMatchComment(input.slice(0, -knownComment.length), ctx);
	}

	// look for a trailing parenthetical clause
	const trailingParentheticalClauseMatch = /\(([^)]+)\)$/.exec(input);
	if (trailingParentheticalClauseMatch) {
		ctx.runningText = trailingParentheticalClauseMatch[0] + ctx.runningText;
		return reverseGreedyMatchComment(
			input.slice(0, -trailingParentheticalClauseMatch[0].length),
			ctx,
		);
	}

	const trailingCommaStatementMatch = /,\s+([^,]+)$/.exec(input);
	if (trailingCommaStatementMatch) {
		const remaining = input.slice(0, -trailingCommaStatementMatch[0].length);
		// avoid leaving only adjectives left as the final food string -
		// that might indicate the comment was part of a food description
		// which includes commas in a list of qualifying adjectives.
		// see the test case "4 boneless, skinless chicken breasts"
		if (!isAllAdjectives(remaining)) {
			ctx.runningText = trailingCommaStatementMatch[0] + ctx.runningText;
			return reverseGreedyMatchComment(remaining, ctx);
		}
	}

	return {
		matched: ctx.runningText,
		remaining: input,
	};
}
