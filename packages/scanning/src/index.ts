import cheerio from 'cheerio';
import { extract } from './extractor.js';

export async function scanWebRecipe(siteUrl: string) {
	const response = await fetch(siteUrl, {});
	const text = await response.text();
	if (response.ok) {
		const $ = cheerio.load(text);
		return extract($, siteUrl);
	} else {
		throw new Error(
			`Could not load site: ${response.status} ${response.statusText}, ${text}`,
		);
	}
}
