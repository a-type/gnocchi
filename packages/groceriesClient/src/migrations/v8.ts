import v7Schema from '../client/schemaVersions/v7.js';
import v8Schema from '../client/schemaVersions/v8.js';
import { migrate } from '@verdant-web/web';

export default migrate(
	v7Schema,
	v8Schema,
	async ({ migrate, withDefaults }) => {
		// add or modify migration logic here
		// if a line has a type error, that indicates the shape of your models may have changed
		await migrate('categories', (old) => withDefaults('categories', old));
		await migrate('items', (old) => withDefaults('items', old));
		await migrate('foodCategoryAssignments', (old) =>
			withDefaults('foodCategoryAssignments', old),
		);
		await migrate('suggestions', (old) => withDefaults('suggestions', old));
	},
);
