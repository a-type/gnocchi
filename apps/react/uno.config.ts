// uno.config.ts
import { defineConfig } from 'unocss';
import variantGroup from '@unocss/transformer-variant-group';
import presetAglio from '@a-type/ui/uno-preset';

export default defineConfig({
	presets: [presetAglio()],
	transformers: [variantGroup()],
	preflights: [
		{
			getCSS: () => `
			html, body, #root {
				display: flex;
				flex-direction: column;
			}

			#root {
				flex: 1;
			}
		`,
		},
	],
	// content: {
	// 	pipeline: {
	// 		include: [
	// 			/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
	// 			'**/@a-type/ui/**/*.js',
	// 		],
	// 	},
	// },
});
