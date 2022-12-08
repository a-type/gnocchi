import { vars } from '@/theme.css.js';
import { calc } from '@vanilla-extract/css-utils';
import { recipe } from '@vanilla-extract/recipes';

export const root = recipe({
	base: {
		width: '100%',
		height: '1px',
		backgroundColor: vars.colors.black,
		position: 'relative',
	},
	variants: {
		compensate: {
			[0]: {
				left: 0,
				right: 0,
			},
			[1]: {
				left: calc(vars.space[1]).multiply(-1).toString(),
				width: calc(vars.space[1]).multiply(2).add('100%').toString(),
			},
			[2]: {
				left: calc(vars.space[2]).multiply(-1).toString(),
				width: calc(vars.space[2]).multiply(2).add('100%').toString(),
			},
			[3]: {
				left: calc(vars.space[3]).multiply(-1).toString(),
				width: calc(vars.space[3]).multiply(2).add('100%').toString(),
			},
			[4]: {
				left: calc(vars.space[4]).multiply(-1).toString(),
				width: calc(vars.space[4]).multiply(2).add('100%').toString(),
			},
			[5]: {
				left: calc(vars.space[5]).multiply(-1).toString(),
				width: calc(vars.space[5]).multiply(2).add('100%').toString(),
			},
			[6]: {
				left: calc(vars.space[6]).multiply(-1).toString(),
				width: calc(vars.space[6]).multiply(2).add('100%').toString(),
			},
		},
		padded: {
			true: {
				marginTop: vars.space[4],
				marginBottom: vars.space[4],
			},
			false: {
				marginTop: 0,
				marginBottom: 0,
			},
		},
	},
	defaultVariants: {
		compensate: 0,
		padded: false,
	},
});
