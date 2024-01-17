import v15Schema, {
	MigrationTypes as V15Types,
} from '../client/schemaVersions/v15.js';
import v16Schema, {
	MigrationTypes as V16Types,
} from '../client/schemaVersions/v16.js';
import { createMigration } from '@verdant-web/store';
import { readRawIdb } from '../readRawIdb.js';

export default createMigration(v15Schema, v16Schema, async ({ mutations }) => {
	// load recipes from the recipes database into the groceries database
	// - this migration consolidates both into one library

	try {
		await readRawIdb('recipes_collections', 7, 'recipes', async (recipe) => {
			await mutations.recipes.put(recipe);
		});
	} catch (e) {
		if (
			(e as DOMException)?.message?.includes(
				'One of the specified object stores was not found',
			)
		) {
			// this is expected if the recipes database doesn't exist
			return;
		}
		console.error('Error migrating recipes', e);
	}
});
