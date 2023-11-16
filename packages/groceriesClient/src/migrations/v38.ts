import v37Schema, {
	MigrationTypes as V37Types,
} from '../client/schemaVersions/v37.js';
import v38Schema, {
	MigrationTypes as V38Types,
} from '../client/schemaVersions/v38.js';
import { createMigration } from '@verdant-web/store';

export default createMigration<V37Types, V38Types>(
	v37Schema,
	v38Schema,
	async ({ migrate }) => {
		await migrate('foods', (old) => {
			return {
				...old,
				inInventory: !!old.lastPurchasedAt,
			};
		});
	},
);
