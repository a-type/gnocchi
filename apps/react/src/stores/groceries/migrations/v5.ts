import { migrate } from '@lo-fi/web';
import { v4Schema } from './v4.js';
import v5Schema from '../schema.js';

export default migrate(v4Schema, v5Schema, async ({ identity, migrate }) => {
	await Promise.all([
		migrate('items', identity),
		migrate('categories', identity),
		migrate('foodCategoryAssignments', identity),
	]);
});
