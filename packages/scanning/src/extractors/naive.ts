import { CheerioAPI } from 'cheerio';
import {
	extractNumber,
	findFirstMatch,
	findFirstMatches,
	minutesToIsoDuration,
	toYield,
} from './utils.js';
import { ExtractorData } from './types.js';

export async function naive($: CheerioAPI): Promise<ExtractorData | null> {
	let titleElement = findFirstMatch($, [
		'#title',
		'.title',
		'.recipe__title',
		'.recipe h1',
		'h1',
	]);
	let authorElement = findFirstMatch($, [
		'.recipe .author',
		'.recipe [class*="author"]',
		'.author',
		'[class*="author"]',
	]);
	let prepTimeElement = findFirstMatch($, [
		'.recipe .prep-time',
		'.recipe .prepTime',
		'.recipe [class*="prep"][class*="time"]',
		'.prep-time',
		'.prepTime',
	]);
	let cookTimeElement = findFirstMatch($, [
		'.recipe .cook-time',
		'.recipe .cookTime',
		'.recipe [class*="cook"][class*="time"]',
		'.cook-time',
		'.cookTime',
	]);
	let totalTimeElement = findFirstMatch($, [
		'.recipe .total-time',
		'.recipe .totalTime',
		'.recipe [class*="total"][class*="time"]',
		'.total-time',
		'.totalTime',
	]);
	let servingsElement = findFirstMatch($, [
		'.recipe .servings',
		'.recipe [class*="servings"]',
		'.servings',
		'[class*="servings"]',
	]);
	let ingredientsList = findFirstMatches($, [
		'.recipe .ingredients .ingredient',
		'.ingredients .ingredient',
		'li.ingredient',
		'ul.ingredients li',
		'.ingredients > *',
		'.recipe__list--ingredients li',
	]);
	let instructionsList = findFirstMatches($, [
		'.recipe .instructions .instruction',
		'.recipe .steps .step',
		'.instructions .instruction',
		'.steps .step',
		'li.instruction',
		'li.step',
		'ul.instructions li',
		'ul.steps li',
		'.instructions > *',
		'.steps > *',
		'.recipe__list-step',
	]);
	let imageElement = findFirstMatch($, [
		'.recipe img.image',
		'.recipe img[class*="image"]',
		'.recipe img',
		'img',
	]);

	let ingredientsText: string[] = [];
	if (ingredientsList) {
		ingredientsList.each(function (i, el) {
			ingredientsText.push($(el).text().trim());
		});
	}

	let stepsText: string[] = [];
	if (instructionsList) {
		instructionsList.each(function (i, el) {
			stepsText.push($(el).text().trim());
		});
	}

	let prepTime: number | undefined = undefined;
	let cookTime: number | undefined = undefined;
	let totalTime: number | undefined = undefined;

	if (prepTimeElement) {
		prepTime = extractNumber($(prepTimeElement).text());
	}
	if (cookTimeElement) {
		cookTime = extractNumber($(cookTimeElement).text());
	}
	if (totalTimeElement) {
		totalTime = extractNumber($(totalTimeElement).text());
	}

	return {
		title: titleElement?.text().trim(),
		author: authorElement?.text().trim(),
		image: imageElement && imageElement.attr('src'),
		prepTimeMinutes: prepTime,
		cookTimeMinutes: cookTime,
		totalTimeMinutes: totalTime,
		servings: servingsElement && toYield($(servingsElement).text().trim()),
		rawIngredients: ingredientsText,
		steps: stepsText,
		copyrightHolder: authorElement?.text().trim(),
	};
}
