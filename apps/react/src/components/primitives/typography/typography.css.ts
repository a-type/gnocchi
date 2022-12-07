import { vars } from '@/theme.css.js';
import { style, styleVariants } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const heading = style({
	marginTop: 0,

	selectors: {
		'h1&': {
			fontFamily: vars.fonts.title,
			fontSize: vars.fontSizes['3xl'],
			fontWeight: 'normal',
		},
		'h2&': {
			fontSize: vars.fontSizes.lg,
			fontFamily: vars.fonts.title,
			fontWeight: 'bold',
			color: vars.colors.gray90,
		},
		'h3&': {},
		'h4&': {},
		'h5&': {},
	},
});

export const paragraph = recipe({
	base: {
		lineHeight: 1.5,
	},
	variants: {
		size: {
			xs: {
				fontSize: vars.fontSizes.xs,
			},
			sm: {
				fontSize: vars.fontSizes.sm,
			},
			default: {
				fontSize: vars.fontSizes.md,
			},
		},
	},
	defaultVariants: {
		size: 'default',
	},
});

export const span = styleVariants({
	xs: {
		fontSize: vars.fontSizes.xs,
	},
	sm: {
		fontSize: vars.fontSizes.sm,
	},
	default: {
		fontSize: vars.fontSizes.md,
	},
});
