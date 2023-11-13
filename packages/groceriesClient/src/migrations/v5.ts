import v4Schema, {
	MigrationTypes as V4Types,
} from '../client/schemaVersions/v4.js';
import v5Schema, {
	MigrationTypes as V5Types,
} from '../client/schemaVersions/v5.js';
import { createMigration } from '@verdant-web/store';
import { trpcClient } from '../trpc.js';

export default createMigration<V4Types, V5Types>(
	v4Schema,
	v5Schema,
	async ({ mutations }) => {
		try {
			const defaultCategories = await trpcClient.categories.defaults.query();
			for (const defaultCategory of defaultCategories) {
				await mutations.categories.put({
					id: defaultCategory.id,
					name: defaultCategory.name,
					sortKey: defaultCategory.sortKey,
				});
			}
		} catch (error) {
			console.error(error);
		}
	},
);
