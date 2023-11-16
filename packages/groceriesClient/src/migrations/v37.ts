import v36Schema, {
	MigrationTypes as V36Types,
} from '../client/schemaVersions/v36.js';
import v37Schema, {
	MigrationTypes as V37Types,
} from '../client/schemaVersions/v37.js';
import { createMigration } from '@verdant-web/store';

export default createMigration<V36Types, V37Types>(
	v36Schema,
	v37Schema,
	async ({ queries, migrate }) => {
		// load all purchased items, move their expiresAt to their food
		const purchasedItems = await queries.items.findAll({
			where: 'purchased',
			equals: 'yes',
		});

		const foodsToExpirations = {} as Record<string, number>;
		for (const purchasedItem of purchasedItems) {
			if (!purchasedItem.food || !purchasedItem.expiresAt) continue;
			const current = foodsToExpirations[purchasedItem.food];
			if (current && current > purchasedItem.expiresAt) continue;
			foodsToExpirations[purchasedItem.food] = purchasedItem.expiresAt;
		}

		await migrate('foods', async (old) => {
			const expiresAt =
				foodsToExpirations[old.canonicalName] ||
				old.alternateNames.reduce((expiresAt, alternateName) => {
					return expiresAt || foodsToExpirations[alternateName];
				}, 0) ||
				null;

			return {
				...old,
				expiresAt,
			};
		});
	},
);
