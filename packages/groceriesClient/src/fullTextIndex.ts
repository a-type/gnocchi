import { removeStopwords } from 'stopword';

export function fullTextIndex(str: string) {
	return removeStopwords(str.split(/\s+/)).map((s) => s.toLowerCase());
}
