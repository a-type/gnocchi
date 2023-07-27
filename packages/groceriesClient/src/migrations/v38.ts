import v37Schema from '../client/schemaVersions/v37.js';
import v38Schema from '../client/schemaVersions/v38.js';
import { migrate } from '@verdant-web/store';

export default migrate(v37Schema, v38Schema, async ({ migrate }) => {
	// add or modify migration logic here. you must provide migrations for
	// any collections that have changed field types or added new non-nullable
	// fields without defaults
	// migrate('collectionName', async (old) => ({ /* new */ }));
	await migrate('foods', (old) => {
		return {
			...old,
			inInventory: !!old.lastPurchasedAt,
		};
	});
});
