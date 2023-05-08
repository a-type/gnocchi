import v28Schema from '../client/schemaVersions/v28.js';
import v29Schema from '../client/schemaVersions/v29.js';
import { migrate } from '@verdant-web/store';

export default migrate(
	v28Schema,
	v29Schema,
	async ({ migrate, withDefaults, info }) => {
		await migrate('foods', (old) => withDefaults('foods', old));
		await migrate('recipes', (old) => withDefaults('recipes', old));
	},
);
