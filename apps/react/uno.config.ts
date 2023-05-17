// uno.config.ts
import { defineConfig } from 'unocss';
import variantGroup from '@unocss/transformer-variant-group';
import presetAglio from '@aglio/ui/uno-preset';

export default defineConfig({
	presets: [presetAglio()],
	transformers: [variantGroup()],
});

const themeColors = ['red', 'green', 'yellow', 'blue', 'purple'];
function roundTens(num: number) {
	return Math.round(num / 10) * 10;
}
function asPaletteValue(num: number) {
	return roundTens(num).toString().padStart(2, '0');
}
function generateColors(from: number, to: number) {
	const increment = (to - from) / 3;
	const map = themeColors.reduce((acc, color) => {
		acc[`--color-${color}-wash`] = `var(--palette-${color}-${asPaletteValue(
			from,
		)})`;
		acc[`--color-${color}-light`] = `var(--palette-${color}-${asPaletteValue(
			from + roundTens(increment),
		)})`;
		acc[`--color-${color}`] = `var(--palette-${color}-${asPaletteValue(
			from + roundTens(increment * 2),
		)})`;
		acc[`--color-${color}-dark`] = `var(--palette-${color}-${asPaletteValue(
			from + roundTens(increment * 3),
		)})`;
		return acc;
	}, {} as Record<string, string>);
	return Object.entries(map).reduce(
		(str, [key, value]) => str + `${key}: ${value};\n`,
		'',
	);
}

const lightColors = generateColors(90, 40);
const darkColors = generateColors(0, 60);
