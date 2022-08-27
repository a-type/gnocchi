import { commentsParser } from './commentsParser.js';
import { depluralize } from './depluralize.js';
import {
	greedyMatchNumber,
	greedyMatchOf,
	greedyMatchUnit,
	reverseGreedyMatchComment,
} from './greedyMatchers.js';
import { numberParser } from './numberParser.js';
import { unitParser } from './unitParser.js';

const DEFAULT_UNIT = '';
const DEFAULT_QUANTITY = 1;
const DEFAULT_FOOD = null;

/**
 * Algorithmic process:
 *
 * I: Detect number, unit, and remainder
 *
 * 1. Eagerly look for [...number[/number?]] [known unit] [of?] [...rest] structure
 *   a. for each block, find and match with known words, recording the matched range
 *      and using the remainder to process the next block
 *   b. multiple consecutive numbers are multiplied together for a final total
 * 2. Look for [number[/number?]] ([number] [unit]) [of?] [...rest] structure
 *   a. e.g. "3 (12oz) can cream of mushroom soup"
 * 3. Proceed with [number?] [...rest] structure.
 *
 * II: Parse remainder for comments and preparations
 */
export function parseIngredient(source: string) {
	const numberResult = greedyMatchNumber(source);
	const unitResult = greedyMatchUnit(numberResult.remaining);
	const ofResult = greedyMatchOf(unitResult.remaining);
	const commentResult = reverseGreedyMatchComment(ofResult.remaining);

	return {
		original: source,
		quantity: numberResult.matched
			? numberParser(numberResult.matched.trim())
			: DEFAULT_QUANTITY,
		unit: unitResult.matched
			? depluralize(unitParser(unitResult.matched.trim())).toLowerCase()
			: DEFAULT_UNIT,
		food: depluralize(commentResult.remaining.trim()).toLowerCase(),
		comments: commentResult.matched
			? commentsParser(commentResult.matched.trim())
			: [],
	};
}