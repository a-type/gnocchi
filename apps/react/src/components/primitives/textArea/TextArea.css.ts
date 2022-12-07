import { recipe } from '@vanilla-extract/recipes';
import { root as inputRoot } from '../input/Input.css.js';

export const root = recipe({
	base: [
		inputRoot,
		{
			fontFamily: 'inherit',
			fontSize: 'inherit',
			overflow: 'hidden',
		},
	],

	variants: {
		resizeable: {
			true: {
				resize: 'vertical',
			},
			false: {
				resize: 'none',
			},
		},
	},
	defaultVariants: {
		resizeable: true,
	},
});
