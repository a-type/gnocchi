import { migrate } from '@verdant-web/store';
import v2Schema from '../client/schemaVersions/v2.js';
import v3Schema from '../client/schemaVersions/v3.js';

export default migrate(v2Schema, v3Schema, async ({ identity, migrate }) => {
	await Promise.all([
		migrate('items', identity),
		migrate('categories', identity),
		// migrate('foodCategoryAssignments', identity),
	]);
});
