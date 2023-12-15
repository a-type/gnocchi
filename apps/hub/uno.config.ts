// uno.config.ts
import { defineConfig } from 'unocss';
import variantGroup from '@unocss/transformer-variant-group';
import presetAglio from '@a-type/ui/uno-preset';

export default defineConfig({
	presets: [presetAglio()],
	// @ts-ignore
	transformers: [variantGroup()],
	content: {
		filesystem: ['**/*.{html,js,ts,jsx,tsx}'],
	},
	cli: {
		entry: [
			{
				patterns: ['**/*.tsx'],
				outFile: 'public/unocss.css',
			},
		],
	},
});
