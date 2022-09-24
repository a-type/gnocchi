import v1 from './migrations/v1.js';
import v2 from './migrations/v2.js';
import v3 from './migrations/v3.js';
import v4, { v4Schema } from './migrations/v4.js';
export type {
	GroceryCategory,
	FoodCategoryLookup,
	GroceryItem,
} from './migrations/v3.js';

export const schema = v4Schema;

export const migrations = [v1, v2, v3, v4];
