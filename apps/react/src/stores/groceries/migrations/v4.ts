import { migrate } from '@lo-fi/web';
import { v3Schema } from './v3.js';
import v4Schema from '../schema.js';

export default migrate(v3Schema, v4Schema, async ({ identity, migrate }) => {
	await Promise.all([
		migrate('items', identity),
		migrate('categories', identity),
		migrate('foodCategoryAssignments', identity),
	]);
});
