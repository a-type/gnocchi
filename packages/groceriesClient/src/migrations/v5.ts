import v4Schema from '../client/schemaVersions/v4.js';
import v5Schema from '../client/schemaVersions/v5.js';
import { migrate } from '@verdant-web/web';
import { trpcClient } from '../trpc.js';

export default migrate(
	v4Schema,
	v5Schema,
	async ({ withDefaults, migrate, mutations }) => {
		await Promise.all([
			migrate('items', (old) => withDefaults('items', old)),
			migrate('categories', (old) => withDefaults('categories', old)),
			migrate('foodCategoryAssignments', (old) =>
				withDefaults('foodCategoryAssignments', old),
			),
		]);
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
