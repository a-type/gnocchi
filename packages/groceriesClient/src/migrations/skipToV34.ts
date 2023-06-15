import v34Schema from '../client/schemaVersions/v34.js';
import { migrate } from '@verdant-web/store';
import { trpcClient } from '../trpc.js';

export default migrate(v34Schema, async ({ mutations }) => {
	await mutations.collaborationInfo.put({});
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
});
