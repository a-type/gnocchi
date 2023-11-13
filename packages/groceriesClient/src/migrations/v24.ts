import v23Schema, {
	MigrationTypes as V23Types,
} from '../client/schemaVersions/v23.js';
import v24Schema, {
	MigrationTypes as V24Types,
} from '../client/schemaVersions/v24.js';
import { createMigration } from '@verdant-web/store';

export default createMigration<V23Types, V24Types>(
	v23Schema,
	v24Schema,
	async ({ migrate }) => {
		// add or modify migration logic here
		// if a line has a type error, that indicates the shape of your models may have changed

		// rename field
		await migrate('items', function procedure({ expiredAt, ...old }) {
			return {
				...old,
				expiresAt: expiredAt,
			};
		});
	},
);
