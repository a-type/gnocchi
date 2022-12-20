import { parseIngredient } from './parseIngredient.js';
import { describe, it, expect } from 'vitest';

describe('ingredient parsing', () => {
	const testData = [
		['1 cup of sugar', 1, 'cup', 'sugar', []],
		['1/2 cup of sugar', 0.5, 'cup', 'sugar', []],
		['1/4 cup of sugar', 0.25, 'cup', 'sugar', []],
		['½ cup of sugar', 0.5, 'cup', 'sugar', []],
		['¼ cup of sugar', 0.25, 'cup', 'sugar', []],
		['2 cloves garlic', 2, 'clove', 'garlic', []],
		['2 cloves of garlic', 2, 'clove', 'garlic', []],
		['salt and pepper to taste', 1, '', 'salt and pepper', ['to taste']],
		['1 tbsp capers', 1, 'tablespoon', 'caper', []],
		['4 tbsps butter', 4, 'tablespoon', 'butter', []],
		['2 zucchini', 2, '', 'zucchini', []],
		['3/4 lb fettuccine pasta', 0.75, 'pound', 'fettuccine pasta', []],
		[
			'4 boneless, skinless chicken breasts',
			4,
			'',
			'boneless, skinless chicken breast',
			[],
		],
		['3 slices of bread', 3, 'slice', 'bread', []],
		['1 can cream of mushroom soup', 1, 'can', 'cream of mushroom soup', []],
		[
			'1 (12oz) can cream of mushroom soup',
			1,
			'',
			'(12oz) can cream of mushroom soup',
			[],
		],
		['eggs', 1, '', 'egg', []],
		['half a can of black beans', 0.5, 'can', 'black bean', []],
		['a dozen eggs', 12, '', 'egg', []],
		['dozen eggs', 12, '', 'egg', []],
		["a baker's dozen eggs", 13, '', 'egg', []],
		["baker's dozen eggs", 13, '', 'egg', []],
		[
			'1/3 cup salt (divided) (or more to taste) (I prefer kosher sea salt)',
			1 / 3,
			'cup',
			'salt',
			['divided', 'or more to taste', 'I prefer kosher sea salt'],
		],
		['2-3 lbs salmon', 3, 'pound', 'salmon', []],
		/*
    TODO:
    ["3 12oz cans of tomato paste", 3, "12oz can", "tomato paste", []],
    */
	] as const;

	testData.forEach((test) => {
		it('converts ' + test[0], () => {
			const result = parseIngredient(test[0]);
			expect(result.original).toBe(test[0]);
			expect(result.quantity).toBe(test[1]);
			expect(result.unit).toBe(test[2]);
			expect(result.food).toBe(test[3]);
			expect(result.comments).toEqual(test[4]);
		});
	});
});
