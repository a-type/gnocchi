import v29Schema from '../client/schemaVersions/v29.js';
import v30Schema from '../client/schemaVersions/v30.js';
import { migrate } from '@lo-fi/web';

export default migrate(
	v29Schema,
	v30Schema,
	async ({ migrate, withDefaults, info }) => {
		// add or modify migration logic here
		// if a line has a type error, that indicates the shape of your models may have changed
		await migrate('recipes', (old) => withDefaults('recipes', old));
	},
);
