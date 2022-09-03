import v1 from './migrations/v1.js';
import v2, { v2Schema } from './migrations/v2.js';
export type {
	GroceryCategory,
	FoodCategoryLookup,
	GroceryItem,
} from './migrations/v2.js';

export const schema = v2Schema;

export const migrations = [v1, v2];
