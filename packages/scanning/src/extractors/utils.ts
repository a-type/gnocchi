import { toSeconds, parse } from 'iso8601-duration';
import $, { AnyNode, Cheerio, CheerioAPI } from 'cheerio';
import { DetailedStep } from './types.js';

export function extractNumber(
	numberOrString?: number | string,
): number | undefined {
	if (numberOrString === undefined) return undefined;
	if (typeof numberOrString === 'number') {
		return numberOrString;
	}
	if (typeof numberOrString === 'string') {
		return parseInt(numberOrString);
	}
	return undefined;
}

export function extractText($element: Cheerio<AnyNode> | null) {
	if (!$element) {
		return null;
	}
	return collapseWhitespace($element.text().trim());
}

export function toArray(data: string | string[]): string[] {
	if (!data) {
		return [];
	}
	if (Array.isArray(data)) {
		return data;
	}
	return data.split(/\n/);
}

export function collapseWhitespace(line: string, pattern = /\t|\n/g) {
	return line.trim().replaceAll(pattern, ' ').replaceAll(/\s+/g, ' ');
}

export function isoToMinutes(isoDuration?: string) {
	if (!isoDuration || !isoDuration.startsWith('P')) {
		return 0;
	}
	try {
		const parsed = parse(isoDuration);
		return Math.floor(toSeconds(parsed) / 60);
	} catch (_) {
		return 0;
	}
}

export function getSiteName($: CheerioAPI) {
	const siteName = $('meta[property="og:site_name"]').attr('content');
	if (siteName) {
		return siteName;
	}
	return $('title').text();
}

export function minutesToIsoDuration(minutes?: number) {
	if (!minutes) {
		return undefined;
	}
	return `PT${minutes}M`;
}

export function toYield(yieldStr: string) {
	if (!yieldStr) {
		return null;
	}
	return parseInt(yieldStr.toLowerCase().replace('servings', ''));
}

export function findFirstMatch($: CheerioAPI, selectors: string[]) {
	for (var i = 0; i < selectors.length; i++) {
		var el = $(selectors[i]);
		if (el.length) {
			return $(el.get(0));
		}
	}
	return null;
}

export function findFirstMatches($: CheerioAPI, selectors: string[]) {
	for (var i = 0; i < selectors.length; i++) {
		var els = $(selectors[i]);
		if (els && els.length) {
			return els;
		}
	}
	return null;
}

export function listToStrings($: CheerioAPI, list: Cheerio<AnyNode>) {
	return list
		.toArray()
		.map((el) => $(el).text().trim())
		.map((s) => removeAnyHTMLTags(collapseWhitespace(s)));
}

export function instructionListToSteps(
	$: CheerioAPI,
	list: Cheerio<AnyNode>,
): DetailedStep[] {
	return list
		.toArray()
		.map((el) => parseInstructionInternalText($(el)))
		.flat();
}

/**
 * Converts strings like
 * "1 hour 30 minutes"
 * "1 hour"
 * "30 minutes"
 * "1h 30m"
 * "1h"
 * "30m"
 * to minutes
 */
export function humanTimeToMinutes(timeString: string) {
	if (!timeString) {
		return 0;
	}
	const hours = timeString.match(/(\d+)\s?h/);
	const minutes = timeString.match(/(\d+)\s?m/);
	let totalMinutes = 0;
	if (hours) {
		totalMinutes += parseInt(hours[1]) * 60;
	}
	if (minutes) {
		totalMinutes += parseInt(minutes[1]);
	}
	return totalMinutes;
}

/**
 * Parses an instruction element, splitting any paragraphs
 * into new steps.
 *
 * Returns detailed steps.
 */
export function parseInstructionInternalText($el: Cheerio<AnyNode>) {
	// iterate over child nodes. text nodes are appended together into one step,
	// paragraphs are split into new steps
	const steps: DetailedStep[] = [];
	let currentStep: DetailedStep = { type: 'step', content: '' };
	$el.contents().each((_, el) => {
		if (el.type === 'text') {
			currentStep.content += el.data;
		} else if (el.type === 'tag' && el.name === 'br') {
			steps.push(currentStep);
			currentStep = { type: 'step', content: '' };
		} else if (
			el.type === 'tag' &&
			((el.name.startsWith('h') && el.name.length === 2) ||
				el.name === 'strong')
		) {
			steps.push(currentStep);
			steps.push({ type: 'sectionTitle', content: $(el).text() });
			currentStep = { type: 'step', content: '' };
		} else if (el.type === 'tag' && el.name === 'a') {
			// TODO: support embedded links...
			currentStep.content += $(el).text();
		} else if (el.type === 'tag' && el.name === 'img') {
			// ignore images
		} else {
			steps.push(currentStep);
			currentStep = { type: 'step', content: '' };
			steps.push(...parseInstructionInternalText($(el)));
		}
	});
	steps.push(currentStep);

	return steps
		.map((step) => ({
			...step,
			content: removeAnyHTMLTags(collapseWhitespace(step.content)),
		}))
		.filter((step) => !!step.content);
}

function removeAnyHTMLTags(text: string) {
	return text.replace(/<\w[^>]*>/gm, '');
}

export function detailedInstructionsToSimple(
	detailedInstructions: DetailedStep[],
) {
	return detailedInstructions.map((step) => {
		return step.content;
	});
}
