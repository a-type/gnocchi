import { migrate } from '@verdant-web/web';
import v1Schema from '../client/schemaVersions/v1.js';
import v2Schema from '../client/schemaVersions/v2.js';

export default migrate(v1Schema, v2Schema, async ({ identity, migrate }) => {
	await Promise.all([
		migrate('items', identity),
		migrate('categories', identity),
		migrate('foodCategoryLookups', identity),
	]);
});
