import { Cheerio, CheerioAPI, Element } from 'cheerio';
import { ExtractorData } from './types.js';
import {
	extractNumber,
	findFirstMatch,
	findFirstMatches,
	humanTimeToMinutes,
	listToStrings,
	toYield,
} from './utils.js';

export async function nyt($: CheerioAPI): Promise<ExtractorData | null> {
	// they use Next right now so data can be extracted from SSR output
	const nextData = nytNextData($);
	if (nextData) return nextData;

	let titleElement = findFirstMatch($, [
		'[class*="contenttitle"]',
		'[class*="recipe-name"]',
		'h1',
	]);
	let authorElement = findFirstMatch($, ['a[href*="/ourcooks/"]']);
	let stats = findFirstMatch($, ['dl[class*="stats"]']);
	let timeElement: Element | null = null;
	if (stats) {
		const children = stats.children().toArray();
		let timeLabelIndex = children.findIndex(
			(child) => $(child).text() === 'Time',
		);
		timeElement = children[timeLabelIndex + 1];
	}
	let servingsElement = findFirstMatch($, ['[class*="recipeYield"]']);
	let ingredientsList = findFirstMatches($, ['li[class*="ingredient"]']);
	let instructionsList = findFirstMatches($, [
		'li[class*="preparation_step"] > p',
	]);
	let imageElement = findFirstMatch($, ['img[sizes="100vw"]']);

	let ingredientsText: string[] = [];
	if (ingredientsList) {
		ingredientsText = ingredientsList.toArray().map((el) => {
			const root = $(el);
			const quantity = root.find('[class*="quantity"]').text();
			const rest = root.find(':not([class])').text();
			return `${quantity} ${rest}`;
		});
	}

	let instructionsText: string[] = [];
	if (instructionsList) {
		instructionsText = listToStrings($, instructionsList);
	}

	let totalTime: number | undefined = undefined;
	if (timeElement) {
		totalTime = humanTimeToMinutes($(timeElement).text());
	}

	let copyrightElement = findFirstMatch($, ['[itemProp*="copyrightHolder"]']);

	return {
		title: titleElement?.text().trim(),
		author: authorElement?.text().trim(),
		image: imageElement && imageElement.attr('src'),
		prepTimeMinutes: undefined,
		cookTimeMinutes: undefined,
		totalTimeMinutes: totalTime,
		servings: servingsElement && toYield(servingsElement.text()),
		rawIngredients: ingredientsText,
		steps: instructionsText,
		copyrightHolder: copyrightElement?.text() || 'The New York Times Company',
	};
}

function nytNextData($: CheerioAPI): ExtractorData | null {
	const nextDataScript = $('#__NEXT_DATA__');
	if (!nextDataScript) return null;
	const nextData = JSON.parse(nextDataScript.text());
	const recipe = nextData?.props?.pageProps.recipe;
	if (!recipe) return null;
	try {
		return {
			title: recipe.title,
			author: recipe.author,
			image: recipe.image?.src?.article,
			totalTimeMinutes: recipe.time
				? humanTimeToMinutes(recipe.time)
				: undefined,
			servings: recipe.recipeYield ? toYield(recipe.recipeYield) : undefined,
			rawIngredients: recipe.ingredients.ingredients.map(
				(i) => `${i.quantity} ${i.text}`,
			),
			steps: recipe.steps.steps.map((s) => s.description),
			copyrightHolder: 'The New York Times Company',
		};
	} catch (e) {
		return null;
	}
}
