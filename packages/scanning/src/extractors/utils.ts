import { toSeconds, parse } from 'iso8601-duration';
import { AnyNode, Cheerio, CheerioAPI } from 'cheerio';

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
		.map((s) => collapseWhitespace(s));
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
