import v33Schema from '../client/schemaVersions/v33.js';
import v34Schema from '../client/schemaVersions/v34.js';
import { migrate } from '@verdant-web/store';

export default migrate(
	v33Schema,
	v34Schema,
	async ({ migrate, identity, info }) => {
		// add or modify migration logic here
		// if a line has a type error, that indicates the shape of your models may have change
		migrate('foods', identity);
	},
);
