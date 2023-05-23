import v32Schema from '../client/schemaVersions/v32.js';
import v33Schema from '../client/schemaVersions/v33.js';
import { migrate } from '@verdant-web/store';

export default migrate(
	v32Schema,
	v33Schema,
	async ({ migrate, withDefaults, info }) => {
		await migrate('foods', (old) => withDefaults('foods', old));
	},
);
