import v11Schema from '../client/schemaVersions/v11.js';
import v12Schema from '../client/schemaVersions/v12.js';
import { migrate } from '@verdant-web/store';

export default migrate(
	v11Schema,
	v12Schema,
	async ({ migrate, withDefaults, mutations }) => {
		// add or modify migration logic here
		// if a line has a type error, that indicates the shape of your models may have changed
		await migrate('categories', (old) => withDefaults('categories', old));
		await migrate('items', (old) => withDefaults('items', old));
		await migrate('foodCategoryAssignments', (old) =>
			withDefaults('foodCategoryAssignments', old),
		);
		await migrate('suggestions', (old) => withDefaults('suggestions', old));
		await migrate('lists', (old) => withDefaults('lists', old));

		await mutations.collaborationInfo.put({});
	},
);
