import v25Schema from '../client/schemaVersions/v25.js';
import v26Schema from '../client/schemaVersions/v26.js';
import { migrate } from '@verdant-web/store';

export default migrate(
	v25Schema,
	v26Schema,
	async ({ migrate, withDefaults, info }) => {
		// add or modify migration logic here
		// if a line has a type error, that indicates the shape of your models may have changed
		await migrate('categories', (old) => withDefaults('categories', old));
		await migrate('items', (old) => withDefaults('items', old));
		await migrate('foods', (old) => withDefaults('foods', old));
		await migrate('suggestions', (old) => withDefaults('suggestions', old));
		await migrate('lists', (old) => withDefaults('lists', old));
		await migrate('collaborationInfo', (old) =>
			withDefaults('collaborationInfo', old),
		);
		await migrate('recipes', (old) => withDefaults('recipes', old));
		await migrate('recipeTagMetadata', (old) =>
			withDefaults('recipeTagMetadata', old),
		);
	},
);
