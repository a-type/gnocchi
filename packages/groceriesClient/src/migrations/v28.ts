import v27Schema from '../client/schemaVersions/v27.js';
import v28Schema from '../client/schemaVersions/v28.js';
import { migrate } from '@verdant-web/store';

export default migrate(
	v27Schema,
	v28Schema,
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
