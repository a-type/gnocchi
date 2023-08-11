import { Cheerio, CheerioAPI, Element } from 'cheerio';
import {
	detailedInstructionsToSimple,
	extractNumber,
	isoToMinutes,
	parseInstructionInternalText,
} from './utils.js';
import { ExtractorData } from './types.js';

export async function microdata($: CheerioAPI): Promise<ExtractorData | null> {
	let elems = $('[itemscope][itemtype="http://schema.org/Recipe"]');
	if (elems.length === 0) {
		elems = $('[itemscope][itemtype="https://schema.org/Recipe"]');
	}
	if (elems.length === 0) {
		return null;
	}

	const first = $(elems.get(0)!);
	const name = first.find(' > [itemprop="name"]').text().trim();
	const author = first.find('[itemprop="author"]').text().trim();
	const copyrightHolder = first
		.find('[itemprop="copyrightHolder"]')
		.text()
		.trim();
	const copyrightYear = first.find('[itemprop="copyrightYear"]').text().trim();
	const description = first.find('[itemprop="description"]').text().trim();
	const image = first.find('[itemprop="image"]').attr('src');
	const datePublished = first.find('[itemprop="datePublished"]').text().trim();
	const cookTime = first.find('[itemprop="cookTime"]').text().trim();
	const prepTime = first.find('[itemprop="prepTime"]').text().trim();
	const totalTime = first.find('[itemprop="totalTime"]').text().trim();
	const cookingMethod = first.find('[itemprop="cookingMethod"]').text().trim();
	const recipeCategory = first
		.find('[itemprop="recipeCategory"]')
		.text()
		.trim();
	const recipeCuisine = first.find('[itemprop="recipeCuisine"]').text().trim();
	const recipeYield = first.find('[itemprop="recipeYield"]').text().trim();
	const recipeIngredient = first
		.find('[itemprop="recipeIngredient"]')
		.map((i, e) => $(e).text().trim())
		.get();
	const recipeInstructionElements = first
		.find('[itemprop="recipeInstructions"]')
		.get();
	const recipeInstructionsDetailed = recipeInstructionElements
		.map((e) => {
			return parseInstructionInternalText($(e));
		})
		.flat();

	return {
		title: name,
		description,
		image,
		copyrightHolder,
		copyrightYear,
		author,
		cookTimeMinutes: isoToMinutes(cookTime),
		prepTimeMinutes: isoToMinutes(prepTime),
		totalTimeMinutes: isoToMinutes(totalTime),
		rawIngredients: recipeIngredient,
		steps: detailedInstructionsToSimple(recipeInstructionsDetailed),
		detailedSteps: recipeInstructionsDetailed,
		servings: extractNumber(recipeYield),
	};
}
