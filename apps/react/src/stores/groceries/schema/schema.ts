import v1 from './migrations/v1.js';
import v2 from './migrations/v2.js';
import v3, { v3Schema } from './migrations/v3.js';
export type {
	GroceryCategory,
	FoodCategoryLookup,
	GroceryItem,
} from './migrations/v3.js';

export const schema = v3Schema;

export const migrations = [v1, v2, v3];
