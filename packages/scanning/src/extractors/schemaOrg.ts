import { Cheerio, CheerioAPI, Element } from 'cheerio';
import { ExtractorData } from './types.js';
import {
	extractNumber,
	findFirstMatch,
	findFirstMatches,
	humanTimeToMinutes,
	isoToMinutes,
	listToStrings,
	toYield,
} from './utils.js';

export async function schemaOrg($: CheerioAPI): Promise<ExtractorData | null> {
	let scripts = $('script');
	// find a script that has a Schema.org JSON-LD object for a Recipe
	let s = scripts
		.filter((i, el) => {
			let text = $(el).text();
			try {
				let parsed = JSON.parse(text);
				if (Array.isArray(parsed)) {
					parsed = parsed[0];
				}
				return (
					parsed['@type'] === 'Recipe' || parsed['@type'].includes('Recipe')
				);
			} catch (e) {
				return false;
			}
		})
		.get(0);
	if (!s) return null;
	let data = JSON.parse($(s).text());
	if (Array.isArray(data)) data = data[0];
	try {
		let yieldValue = data.recipeYield
			? Array.isArray(data.recipeYield)
				? data.recipeYield[0]
				: data.recipeYield
			: undefined;
		return {
			title: data.name || data.headline,
			author: data.author?.name,
			image: data.image?.url,
			description: data.description,
			prepTimeMinutes: data.prepTime ? isoToMinutes(data.prepTime) : undefined,
			cookTimeMinutes: data.cookTime ? isoToMinutes(data.cookTime) : undefined,
			totalTimeMinutes: data.totalTime
				? isoToMinutes(data.totalTime)
				: undefined,
			servings: yieldValue ? toYield(yieldValue) : undefined,
			rawIngredients: data.recipeIngredient,
			steps: data.recipeInstructions.map((step: any) => step.text),
			copyrightHolder: data.copyrightHolder || data.publisher?.name,
			copyrightYear: data.copyrightYear,
		};
	} catch (e) {
		return null;
	}
}
