import { migrate } from '@lo-fi/web';
import v6Schema from '../schema.js';
import { v5Schema } from './v5.js';

export default migrate(v5Schema, v6Schema, async ({ identity, migrate }) => {
	await Promise.all([
		migrate('items', identity),
		migrate('categories', identity),
		migrate('foodCategoryAssignments', identity),
	]);
});
