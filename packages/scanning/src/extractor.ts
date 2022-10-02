import { Cheerio, CheerioAPI } from 'cheerio';

type UnwrapPromise<T extends Promise<any>> = T extends Promise<infer U>
	? U
	: never;

import * as extractors from './extractors/index.js';

const extractorOrdering = [
	extractors.microdata,
	extractors.wprm,
	extractors.naive,
];

async function tryParse($: CheerioAPI) {
	for (const extractor of extractorOrdering) {
		const result = await extractor($);
		if (result) {
			return result;
		}
	}
}

export async function extract($: CheerioAPI, pageUrl: string) {
	const result = await tryParse($);
	return {
		...result,
		url: result?.url || pageUrl,
	};
}

export type ScanResult = UnwrapPromise<ReturnType<typeof extract>>;
