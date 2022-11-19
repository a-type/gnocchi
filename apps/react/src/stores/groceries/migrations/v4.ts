import { migrate } from '@lo-fi/web';
import v3Schema from '../client/schemaVersions/v3.js';
import v4Schema from '../client/schemaVersions/v4.js';

export default migrate(
	v3Schema,
	v4Schema,
	async ({ withDefaults, migrate }) => {
		await Promise.all([
			migrate('items', (old) => withDefaults('items', old)),
			migrate('categories', (old) => withDefaults('categories', old)),
			migrate('foodCategoryAssignments', (old) =>
				withDefaults('foodCategoryAssignments', old),
			),
		]);
	},
);
