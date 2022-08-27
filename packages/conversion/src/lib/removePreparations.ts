import { matchAndRemove } from './matchAndRemove.js';

const prepMatches: RegExp[] = [
	/,?\W+(chopped)/g,
	/,\W+(cleaned)/g,
	/,?\W+(cubed)/g,
	/,\W+(divided)/g,
	/,\W+(drained( and rinsed)?)/g,
	/,?\W+(finely chopped)/g,
	/,\W+(halved)/g,
	/,?\W+(rinsed)/g,
	/,\W+(separated)/g,
	/,?\W+(sliced)/g,
	/,\W+(stripped)/g,
	/,\W+(quartered)/g,
];

export function removePreparations(text: string) {
	const { withoutMatches, matched } = matchAndRemove(text, prepMatches);
	return { text: withoutMatches, preparations: matched };
}
