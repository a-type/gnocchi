import v16Schema from '../client/schemaVersions/v16.js';
import v17Schema from '../client/schemaVersions/v17.js';
import { migrate } from '@verdant-web/web';
import cuid from 'cuid';

export default migrate(v16Schema, v17Schema, async ({ queries, mutations }) => {
	// this migration is only to enforce some data shape for recipe document structure...
	// it changes all 'paragraph' top-level nodes to 'step' nodes in the document
	// and enforces each one has an id attr.
	const recipes = await queries.recipes.findAll();
	for (const recipe of recipes) {
		recipe.instructions = recipe.instructions || { type: 'doc', content: [] };
		recipe.instructions.content = (recipe.instructions.content || [])
			.filter((c: any) => !!c)
			.map((step: { type: string; attrs?: any; content: any }) => ({
				...step,
				type: 'step',
				attrs: {
					id: step.attrs?.id ?? cuid(),
				},
			}));
		await mutations.recipes.put(recipe);
	}
});
