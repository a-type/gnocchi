import v30Schema from '../client/schemaVersions/v30.js';
import v31Schema from '../client/schemaVersions/v31.js';
import { migrate } from '@lo-fi/web';

export default migrate(
	v30Schema,
	v31Schema,
	async ({ migrate, withDefaults, info }) => {
		// add or modify migration logic here
		// if a line has a type error, that indicates the shape of your models may have changed
		await migrate('items', (old) => withDefaults('items', old));
		await migrate('recipes', (old) => withDefaults('recipes', old));
	},
);
