import v10Schema from '../client/schemaVersions/v10.js';
import v11Schema from '../client/schemaVersions/v11.js';
import { migrate } from '@lo-fi/web';

export default migrate(
	v10Schema,
	v11Schema,
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
