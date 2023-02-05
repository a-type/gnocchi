import v18Schema from '../client/schemaVersions/v18.js';
import v19Schema from '../client/schemaVersions/v19.js';
import { migrate } from '@lo-fi/web';

export default migrate(
	v18Schema,
	v19Schema,
	async ({ migrate, withDefaults, info }) => {
		// add or modify migration logic here
		// if a line has a type error, that indicates the shape of your models may have changed
		await migrate('categories', (old) => withDefaults('categories', old));
		await migrate('items', (old) => withDefaults('items', old));
		await migrate('foodCategoryAssignments', (old) =>
			withDefaults('foodCategoryAssignments', old),
		);
		await migrate('suggestions', (old) => withDefaults('suggestions', old));
		await migrate('lists', (old) => withDefaults('lists', old));
		await migrate('collaborationInfo', (old) =>
			withDefaults('collaborationInfo', old),
		);
		await migrate('recipes', (old) => withDefaults('recipes', old));
	},
);
