import v24Schema from '../client/schemaVersions/v24.js';
import v25Schema from '../client/schemaVersions/v25.js';
import { migrate } from '@verdant-web/web';

export default migrate(
	v24Schema,
	v25Schema,
	async ({ migrate, withDefaults, info }) => {
		// add or modify migration logic here
		// if a line has a type error, that indicates the shape of your models may have changed
		await migrate('foods', (old) => withDefaults('foods', old));
	},
);
