import v22Schema from '../client/schemaVersions/v22.js';
import v23Schema from '../client/schemaVersions/v23.js';
import { migrate } from '@lo-fi/web';

export default migrate(
	v22Schema,
	v23Schema,
	async ({ migrate, withDefaults, info }) => {
		await migrate('items', (old) => withDefaults('items', old));
	},
);
