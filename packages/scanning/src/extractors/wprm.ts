import { CheerioAPI } from 'cheerio';
import {
	detailedInstructionsToSimple,
	extractNumber,
	findFirstMatch,
	instructionListToSteps,
} from './utils.js';
import { DetailedStep, ExtractorData } from './types.js';

function parseTime(text?: string) {
	if (!text) {
		return null;
	}

	text = text
		.replace('Prep Time:', '')
		.replace('Cook Time:', '')
		.replace('Total Time:', '');
	const hoursResult = /(\d+)\s+(hours?)/i.exec(text);
	const minsResult = /(\d+)\s+(minutes?)/i.exec(text);

	if (hoursResult || minsResult) {
		const hoursStr = hoursResult && hoursResult[1];
		const minsStr = minsResult && minsResult[1];

		let duration = 0;
		if (hoursStr) {
			const hours = parseInt(hoursStr, 10);
			if (!isNaN(hours)) {
				duration += hours * 60;
			}
		}
		if (minsStr) {
			const mins = parseInt(minsStr, 10);
			if (!isNaN(mins)) {
				duration += mins;
			}
		}
		return duration;
	}
}

export async function wprm($: CheerioAPI): Promise<ExtractorData | null> {
	const wprmRoot = $('.wprm-recipe');
	if (!wprmRoot.length) {
		return null;
	}

	const titleElement = findFirstMatch($, ['.wprm-recipe-name']);
	const authorElement = findFirstMatch($, ['.wprm-recipe-author']);
	const prepTimeElement = findFirstMatch($, [
		'.wprm-recipe-prep-time-container',
	]);
	const cookTimeElement = findFirstMatch($, [
		'.wprm-recipe-cook-time-container',
	]);
	const totalTimeElement = findFirstMatch($, [
		'.wprm-recipe-total-time-container',
	]);
	const servingsElement = findFirstMatch($, ['.wprm-recipe-servings']);
	const ingredientsList = $('.wprm-recipe-ingredient');
	const stepsList = $('.wprm-recipe-instruction');
	const imageElement = findFirstMatch($, [
		'.wprm-recipe-image img',
		'wprm-recipe img',
	]);

	const detailedIngredients = new Array<{
		quantity: number;
		unit: string;
		foodName: string;
		comments: string[];
		original: string;
	}>();

	if (ingredientsList) {
		ingredientsList.each(function (i, el) {
			const amount = $(el).find('.wprm-recipe-ingredient-amount').text().trim();
			const unit = $(el).find('.wprm-recipe-ingredient-unit').text().trim();
			const name = $(el).find('.wprm-recipe-ingredient-name').text().trim();
			const notes = $(el).find('.wprm-recipe-ingredient-notes').text().trim();

			detailedIngredients.push({
				original: $(el).text().trim(),
				quantity: extractNumber(amount) || 1,
				unit,
				foodName: name,
				comments: [notes],
			});
		});
	}

	let detailedSteps = new Array<DetailedStep>();
	let steps = new Array<string>();
	if (stepsList) {
		detailedSteps = instructionListToSteps($, stepsList);
		steps = detailedInstructionsToSimple(detailedSteps);
	}

	const prepTime = parseTime(prepTimeElement?.text());
	const cookTime = parseTime(cookTimeElement?.text());
	const totalTime = parseTime(totalTimeElement?.text());

	return {
		title: titleElement && titleElement.text().trim(),
		author: authorElement && authorElement.text().trim(),
		image:
			imageElement &&
			(imageElement.attr('data-lazy-srcset') || imageElement.attr('src')),
		prepTimeMinutes: prepTime,
		cookTimeMinutes: cookTime,
		totalTimeMinutes: totalTime,
		servings: extractNumber(servingsElement?.text().trim()),
		detailedIngredients,
		rawIngredients: detailedIngredients.map((i) => i.original),
		steps,
		detailedSteps,
		copyrightHolder: authorElement?.text().trim(),
	};
}
