import v31Schema from '../client/schemaVersions/v31.js';
import v32Schema from '../client/schemaVersions/v32.js';
import { migrate } from '@verdant-web/store';

export default migrate(
	v31Schema,
	v32Schema,
	async ({ migrate, withDefaults, info }) => {
		// add or modify migration logic here
		// if a line has a type error, that indicates the shape of your models may have changed
		await migrate('recipes', (old) => withDefaults('recipes', old));
	},
);
