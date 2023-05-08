import v21Schema from '../client/schemaVersions/v21.js';
import v22Schema from '../client/schemaVersions/v22.js';
import { migrate } from '@verdant-web/web';

export default migrate(
	v21Schema,
	v22Schema,
	async ({ migrate, withDefaults, info }) => {
		// add or modify migration logic here
		// if a line has a type error, that indicates the shape of your models may have changed
		await migrate('recipes', (old) => withDefaults('recipes', old));
	},
);
