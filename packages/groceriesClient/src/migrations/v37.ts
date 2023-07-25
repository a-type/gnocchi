import v36Schema from '../client/schemaVersions/v36.js';
import v37Schema from '../client/schemaVersions/v37.js';
import { migrate } from '@verdant-web/store';

export default migrate(v36Schema, v37Schema, async ({ queries, migrate }) => {
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
});
