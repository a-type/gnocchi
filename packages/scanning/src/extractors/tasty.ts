import { CheerioAPI } from 'cheerio';
import { ExtractorData } from './types.js';
import {
	collapseWhitespace,
	extractNumber,
	extractText,
	findFirstMatch,
	findFirstMatches,
	humanTimeToMinutes,
	listToStrings,
} from './utils.js';

export async function tasty($: CheerioAPI): Promise<ExtractorData | null> {
	const tastyElement = $('.tasty-recipes');
	if (!tastyElement.length) {
		return null;
	}

	const titleElement = findFirstMatch($, ['.tasty-recipes-title']);
	const authorElement = findFirstMatch($, [
		'.tasty-recipes-author-name',
		'.tasty-recipes-details .author > span:last-child',
	]);
	const prepTimeElement = findFirstMatch($, ['.tasty-recipes-prep-time']);
	const cookTimeElement = findFirstMatch($, ['.tasty-recipes-cook-time']);
	const totalTimeElement = findFirstMatch($, ['.tasty-recipes-total-time']);
	const servingsElement = findFirstMatch($, ['.tasty-recipes-yield']);
	const ingredientsList = findFirstMatches($, [
		'[data-tr-ingredient-checkbox]',
		'.tasty-recipe-ingredient ul > li',
	]);
	const stepsList = findFirstMatches($, [
		'.tasty-recipes-instructions ol > li',
	]);
	const imageElement = findFirstMatch($, ['.tasty-recipes-image img']);

	let basicIngredients = new Array<string>();
	if (ingredientsList) {
		basicIngredients = listToStrings($, ingredientsList);
	}

	let steps = new Array<string>();
	if (stepsList) {
		steps = listToStrings($, stepsList);
	}

	const prepTimeMinutes = prepTimeElement
		? humanTimeToMinutes(prepTimeElement.text())
		: null;
	const cookTimeMinutes = cookTimeElement
		? humanTimeToMinutes(cookTimeElement.text())
		: null;
	const totalTimeMinutes = totalTimeElement
		? humanTimeToMinutes(totalTimeElement.text())
		: null;

	const servings = servingsElement
		? extractNumber(collapseWhitespace(servingsElement.text()))
		: null;

	const author = extractText(authorElement);

	return {
		title: extractText(titleElement),
		author,
		image: imageElement && imageElement.attr('src'),
		prepTimeMinutes,
		cookTimeMinutes,
		totalTimeMinutes,
		servings,
		rawIngredients: basicIngredients,
		steps,
		copyrightHolder: author,
	};
}
