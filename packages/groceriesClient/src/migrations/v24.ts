import v23Schema from '../client/schemaVersions/v23.js';
import v24Schema from '../client/schemaVersions/v24.js';
import { migrate } from '@verdant-web/store';

export default migrate(v23Schema, v24Schema, async ({ migrate }) => {
	// add or modify migration logic here
	// if a line has a type error, that indicates the shape of your models may have changed

	// rename field
	await migrate('items', ({ expiredAt, ...old }) => {
		return {
			...old,
			expiresAt: expiredAt,
		};
	});
});
