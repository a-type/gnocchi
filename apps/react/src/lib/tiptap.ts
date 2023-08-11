import cuid from 'cuid';

export type RecipeInstructionsDocument = {
	type: 'doc';
	content: {
		type: 'sectionTitle' | 'step';
		attrs: {
			id: string;
		};
		content: { type: 'text'; text: string }[];
	}[];
};

/**
 * Converts recipe instruction step lines into a ProseMirror document
 */
export function instructionsToDoc(
	lines: string[],
): undefined | RecipeInstructionsDocument {
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

export function detailedInstructionsToDoc(
	steps: { type: 'step' | 'sectionTitle'; content: string }[],
): undefined | RecipeInstructionsDocument {
	return steps?.length
		? {
				type: 'doc',
				content: steps
					.filter((step) => !!step.content)
					.map((step) => ({
						type: step.type,
						attrs: {
							id: cuid(),
						},
						content: [
							{
								type: 'text',
								text: step.content,
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
