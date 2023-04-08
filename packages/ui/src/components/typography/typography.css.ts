import { vars } from '../../styles/theme.css.js';
import { style, styleVariants } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const heading = recipe({
	base: {
		marginTop: 0,
		marginBottom: 0,
		color: 'inherit',

		selectors: {
			'h1&': {
				fontFamily: vars.fonts.title,
				fontSize: vars.fontSizes['3xl'],
				fontWeight: vars.fontWeights.bold,
			},
			'h2&': {
				fontSize: vars.fontSizes.lg,
				fontFamily: vars.fonts.title,
				fontWeight: vars.fontWeights.bold,
				color: vars.colors.gray90,
			},
			'h3&': {
				fontSize: vars.fontSizes.md,
				fontFamily: vars.fonts.title,
			},
			'h4&': {},
			'h5&': {},
		},
	},
	variants: {
		gutterBottom: {
			true: {
				marginBottom: vars.space[2],
			},
		},
	},
	defaultVariants: {
		gutterBottom: true,
	},
});

export const paragraph = recipe({
	base: {
		lineHeight: 1.5,
		marginTop: 0,
		marginBottom: 0,
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
			inherit: {
				fontSize: 'inherit',
			},
		},
		gutterBottom: {
			true: {
				marginBottom: vars.space[2],
			},
		},
	},
	defaultVariants: {
		size: 'default',
	},
});

export const span = recipe({
	base: {},
	variants: {
		italic: {
			true: {
				fontStyle: 'italic',
			},
			false: {},
		},
		bold: {
			true: {
				fontWeight: vars.fontWeights.bold,
			},
			false: {},
		},
		size: {
			xs: {
				fontSize: vars.fontSizes.xs,
			},
			sm: {
				fontSize: vars.fontSizes.sm,
			},
			md: {
				fontSize: vars.fontSizes.md,
			},
			lg: {
				fontSize: vars.fontSizes.lg,
			},
			default: {
				fontSize: 'inherit',
			},
		},
		noWrap: {
			true: {
				whiteSpace: 'nowrap',
			},
		},
	},
});
