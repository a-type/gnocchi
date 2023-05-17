// uno.config.ts
import { defineConfig } from 'unocss';
import variantGroup from '@unocss/transformer-variant-group';
import presetAglio from '@aglio/ui/uno-preset';

export default defineConfig({
	presets: [presetAglio()],
	transformers: [variantGroup()],
	cli: {
		entry: {
			patterns: ['**/*.tsx'],
			outFile: 'uno.css',
		},
	},
});

interface CliEntryItem {
	/**
	 * Glob patterns to match files
	 */
	patterns: string[];
	/**
	 * The output filename for the generated UnoCSS file
	 */
	outFile: string;
}
