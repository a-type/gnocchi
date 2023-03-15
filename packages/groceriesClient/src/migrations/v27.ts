import v26Schema from '../client/schemaVersions/v26.js';
import v27Schema from '../client/schemaVersions/v27.js';
import { migrate } from '@lo-fi/web';

export default migrate(
	v26Schema,
	v27Schema,
	async ({ migrate, withDefaults, info }) => {
		// add or modify migration logic here
		// if a line has a type error, that indicates the shape of your models may have changed
		await migrate('recipes', (old) => withDefaults('recipes', old));
	},
);
