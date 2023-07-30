// uno.config.ts
import { defineConfig } from 'unocss';
import variantGroup from '@unocss/transformer-variant-group';
import presetAglio from '@aglio/ui/uno-preset';

export default defineConfig({
	presets: [presetAglio()],
	// @ts-ignore
	transformers: [variantGroup()],
	content: {
		filesystem: ['**/*.{html,js,ts,jsx,tsx}'],
	},
});
