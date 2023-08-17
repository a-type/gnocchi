import { CheerioAPI } from 'cheerio';
import {
	detailedInstructionsToSimple,
	extractNumber,
	findFirstMatch,
	findFirstMatches,
	humanTimeToMinutes,
	instructionListToSteps,
	minutesToIsoDuration,
	toYield,
} from './utils.js';
import { DetailedStep, ExtractorData } from './types.js';

export async function naive($: CheerioAPI): Promise<ExtractorData | null> {
	let titleElement = findFirstMatch($, [
		'#title',
		'h1',
		'h2.title',
		'h3.title',
		'.recipe__title',
		'.Recipe__title',
		'.recipe h1',
		'.title',
		'.mv-create-title',
		'o-AssetTitle__a-Headline',
	]);
	let authorElement = findFirstMatch($, [
		'.recipe .author',
		'.recipe [class*="author"]',
		'.author',
		'.Post__authorName',
		'[class*="author"]',
		'o-Attribution__a-Name',
	]);
	let prepTimeElement = findFirstMatch($, [
		'.recipe .prep-time',
		'.recipe .prepTime',
		'.recipe [class*="prep"][class*="time"]',
		'.prep-time',
		'.prepTime',
		'.mv-create-time-prep > .mv-create-time-format',
		'.RecipePostIntro__infoEntry--prepTime > .RecipePostIntro__infoText',
	]);
	let cookTimeElement = findFirstMatch($, [
		'.recipe .cook-time',
		'.recipe .cookTime',
		'.recipe [class*="cook"][class*="time"]',
		'.cook-time',
		'.cookTime',
		'.mv-create-time-active > .mv-create-time-format',
		'm-RecipeInfo__a-Description--Active',
		'.RecipePostIntro__infoEntry--cookTime > .RecipePostIntro__infoText',
	]);
	let totalTimeElement = findFirstMatch($, [
		'.recipe .total-time',
		'.recipe .totalTime',
		'.recipe [class*="total"][class*="time"]',
		'.total-time',
		'.totalTime',
		'.mv-create-time-total > .mv-create-time-format',
		'm-RecipeInfo__a-Description--Total',
	]);
	let servingsElement = findFirstMatch($, [
		'.recipe .servings',
		'.recipe [class*="servings"]',
		'.servings',
		'[class*="servings"]',
		'.mv-create-time-yield > .mv-create-time-format',
		'o-RecipeInfo__m-Yield o_RecipeInfo__a-Description',
	]);
	let ingredientsList = findFirstMatches($, [
		'.recipe .ingredients .ingredient',
		'.ingredients .ingredient',
		'li.ingredient',
		'ul.ingredients li',
		'.ingredients > *',
		'.recipe__list--ingredients li',
		'.recipe-ingredients li',
		'.Recipe__ingredient',
		'[class*=ingredients] li',
		'.mv-create-ingredients li',
		'.o-Ingredients__a-Ingredient',
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
		'.recipe-instructions li',
		'.Recipe__instructionStep',
		'.recipe-steps li',
		'.recipeSteps li',
		'[class*=instructions] li',
		'[class*=steps] li',
		'.mv-create-instructions p',
		'o-Method__m-Step',
	]);
	let imageElement = findFirstMatch($, [
		'.recipe img.image',
		'.recipe img[class*="image"]',
		'.recipe img',
		'.m-MediaBlock__a-Image',
		'.Figure__image--original',
		'img',
	]);

	let ingredientsText: string[] = [];
	if (ingredientsList) {
		ingredientsList.each(function (i, el) {
			ingredientsText.push($(el).text().trim());
		});
	}

	let stepsText: string[] = [];
	let detailedSteps: DetailedStep[] = [];
	if (instructionsList) {
		detailedSteps = instructionListToSteps($, instructionsList);
		stepsText = detailedInstructionsToSimple(detailedSteps);
	}

	let prepTime: number | undefined = undefined;
	let cookTime: number | undefined = undefined;
	let totalTime: number | undefined = undefined;

	if (prepTimeElement) {
		prepTime = humanTimeToMinutes($(prepTimeElement).text());
	}
	if (cookTimeElement) {
		cookTime = humanTimeToMinutes($(cookTimeElement).text());
	}
	if (totalTimeElement) {
		totalTime = humanTimeToMinutes($(totalTimeElement).text());
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
		detailedSteps,
		copyrightHolder: authorElement?.text().trim(),
	};
}
