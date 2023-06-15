import { adjectives } from './lists.js';

export function isAllAdjectives(str: string) {
	const words = str.split(/\s+/g);
	return words.every((word) => adjectives.includes(word));
}
