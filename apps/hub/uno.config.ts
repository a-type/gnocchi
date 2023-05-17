// uno.config.ts
import { defineConfig } from 'unocss';
import variantGroup from '@unocss/transformer-variant-group';
import presetAglio from '@aglio/ui/uno-preset';

export default defineConfig({
	presets: [presetAglio()],
	transformers: [variantGroup()],
});
