import v6Schema from '../client/schemaVersions/v6.js';
import v7Schema from '../client/schemaVersions/v7.js';
import { migrate } from '@lo-fi/web';

export default migrate(
	v6Schema,
	v7Schema,
	async ({ migrate, withDefaults }) => {
		// add or modify migration logic here
		// if a line has a type error, that indicates the shape of your models may have changed
		await migrate('categories', (old) => withDefaults('categories', old));
		await migrate('items', (old) => withDefaults('items', old));
		await migrate('foodCategoryAssignments', (old) =>
			withDefaults('foodCategoryAssignments', old),
		);
	},
);
