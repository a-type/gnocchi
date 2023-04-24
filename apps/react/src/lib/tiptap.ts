import cuid from 'cuid';

/**
 * Converts recipe instruction step lines into a ProseMirror document
 */
export function instructionsToDoc(lines: string[]) {
	return lines?.length
		? {
				type: 'doc',
				content: (lines || []).filter(Boolean).map((line: string) => ({
					type: 'step',
					attrs: {
						id: cuid(),
					},
					content: [
						{
							type: 'text',
							text: line,
						},
					],
				})),
		  }
		: undefined;
}

/**
 * Converts a generic string into a generic ProseMirror document
 */
export function stringToDoc(source: string) {
	return {
		type: 'doc',
		content: source
			.split('\n')
			.filter(Boolean)
			.map((str: string) => [
				{
					type: 'paragraph',
					attrs: {
						id: cuid(),
					},
					content: [
						{
							type: 'text',
							text: str,
						},
					],
				},
			]),
	};
}
