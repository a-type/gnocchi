import v4Schema from '../client/schemaVersions/v4.js';
import v5Schema from '../client/schemaVersions/v5.js';
import { migrate } from '@lo-fi/web';

export default migrate(v4Schema, v5Schema, async ({ identity, migrate }) => {
	await Promise.all([
		migrate('items', identity),
		// FIXME: lo-fi #52
		migrate('categories', identity as any),
		migrate('foodCategoryAssignments', identity),
	]);
});
