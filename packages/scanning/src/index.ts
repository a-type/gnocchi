import cheerio from 'cheerio';
import { extract } from './extractor.js';

export async function scanWebRecipe(siteUrl: string) {
	const response = await fetch(siteUrl, {
		headers: {
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
		},
	});
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
