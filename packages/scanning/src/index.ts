export type * from './extractors/types.js';
import { load } from 'cheerio';
import { extract } from './extractor.js';
import { default as robotsParser } from 'robots-parser';

export class ScanForbiddenError extends Error {
	constructor() {
		super("Sorry, this website doesn't allow Gnocchi to scan recipes.");
	}
}

export async function scanWebRecipe(siteUrl: string) {
	const siteAsUrl = new URL(siteUrl);
	const robotsUrl = `${siteAsUrl.origin}/robots.txt`;
	const robotsFileResponse = await fetch(robotsUrl);
	if (robotsFileResponse.status !== 404) {
		const robotsFileText = await robotsFileResponse.text();
		try {
			// @ts-ignore
			const robots = await robotsParser(robotsUrl, robotsFileText);

			if (robots?.isDisallowed(siteUrl, 'Gnocchibot')) {
				return null;
			}
		} catch (e) {
			console.error('Could not parse robots.txt', e);
		}
	}

	const response = await fetch(siteUrl, {
		headers: {
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
		},
	});
	const text = await response.text();
	if (response.ok) {
		const $ = load(text);
		return extract($, siteUrl);
	} else {
		if (response.status === 403) {
			throw new ScanForbiddenError();
		}

		throw new Error(
			`Could not load site: ${response.status} ${response.statusText}, ${text}`,
		);
	}
}
