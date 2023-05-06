import stopword from 'stopword';

export function fullTextIndex(str: string) {
	return stopword.removeStopwords(str.split(/\s+/)).map((s) => s.toLowerCase());
}
