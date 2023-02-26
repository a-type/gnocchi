import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const root = style({
	marginRight: 'auto',
	marginTop: vars.space[2],
	marginBottom: 0,
	fontSize: vars.fontSizes.xs,
	minWidth: 0,
});

export const list = style({
	color: vars.colors.gray70,
	listStyle: 'none',
	padding: 0,
	margin: 0,
	maxWidth: '100%',
	overflow: 'hidden',
	display: 'inline-flex',
	flexDirection: 'column',
});

export const label = style({
	// marginBottom: vars.space[1],
	fontStyle: 'italic',
	display: 'inline',
	marginRight: vars.space[2],
});

export const item = style({
	color: 'inherit',
	fontSize: 'inherit',
	display: 'inline',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	maxWidth: '100%',

	selectors: {
		'&:not(:last-child)::after': {
			content: '", "',
		},
	},
});

export const link = style({
	fontWeight: vars.fontWeights.bold,
});
