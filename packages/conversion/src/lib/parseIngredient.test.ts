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
		['3 slices of bread', 3, 'slice', 'bread', []],
		['1 can cream of mushroom soup', 1, 'can', 'cream of mushroom soup', []],
		[
			'1 (12oz) can cream of mushroom soup',
			1,
			'can',
			'cream of mushroom soup',
			['12oz'],
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
		['2 tsp. mirin (optional)', 2, 'teaspoon', 'mirin', ['optional']],
		[
			'2 Tbsp. unseasoned rice vinegar',
			2,
			'tablespoon',
			'unseasoned rice vinegar',
			[],
		],
		['1 1/2 teaspoons paprika', 1.5, 'teaspoon', 'paprika', []],
		['2 t salt', 2, 'teaspoon', 'salt', []],
		['1/2 T salt', 0.5, 'tablespoon', 'salt', []],
		['□ ¼ cup rice', 0.25, 'cup', 'rice', []],
		['▢ 1 1/4 cup rice', 1.25, 'cup', 'rice', []],
		['1 tin of smoked mussels', 1, 'tin', 'smoked mussel', []],
		[
			'fennel bulb (about 6 oz.), thinly sliced, plus frond',
			1,
			'',
			'fennel bulb',
			['about 6 oz.', 'thinly sliced', 'plus frond'],
		],
		// apostrophe 's'
		["bachan's", 1, '', "bachan's", []],
		['1-2 tsp of salt', 2, 'teaspoon', 'salt', []],
		['1 to 2 tsp of salt', 2, 'teaspoon', 'salt', []],
		['1 or 2 tsps of salt', 2, 'teaspoon', 'salt', []],
		['1.5 sticks of butter', 1.5, 'stick', 'butter', []],
		[
			'2 pounds (4 8-ounce boxes) cream cheese',
			2,
			'pound',
			'cream cheese',
			['4 8-ounce boxes'],
		],
		['tomatoes', 1, '', 'tomato', []],
		// not ideal but good enough
		['3 12oz cans of tomato paste', 36, 'oz can', 'tomato paste', []],
		// tricky cases
		[
			'4 boneless, skinless chicken breasts',
			4,
			'',
			'boneless, skinless chicken breast',
			[],
		],
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

	it('removes item glyphs', () => {
		expect(parseIngredient('- 1 cup of sugar').sanitized).toBe(
			'1 cup of sugar',
		);
		expect(parseIngredient('* 1 cup of sugar').sanitized).toBe(
			'1 cup of sugar',
		);
		expect(parseIngredient('• 1 cup of sugar').sanitized).toBe(
			'1 cup of sugar',
		);
		expect(parseIngredient('□ 1 cup of sugar').sanitized).toBe(
			'1 cup of sugar',
		);
		expect(parseIngredient('▪ 1 cup of sugar').sanitized).toBe(
			'1 cup of sugar',
		);
		expect(parseIngredient('▫ 1 cup of sugar').sanitized).toBe(
			'1 cup of sugar',
		);
		expect(parseIngredient('▢ 1 cup of sugar').sanitized).toBe(
			'1 cup of sugar',
		);
	});
});
