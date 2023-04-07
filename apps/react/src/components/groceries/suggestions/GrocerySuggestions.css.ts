import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[1],
	backgroundColor: vars.colors.accentWash,
	overflow: 'hidden',
	transition: `box-shadow 0.2s ${vars.transitions.springy}, transform 0.2s ${vars.transitions.springy}, background-color 0.5s linear`,
	marginBottom: vars.space[2],
	padding: vars.space[2],

	selectors: {
		'&[data-state="closed"]': {
			backgroundColor: 'transparent',
		},
	},
});

export const title = style({
	fontSize: vars.fontSizes.xs,
});

export const list = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[2],
});

export const item = style({
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[2],
	alignItems: 'center',
	paddingLeft: vars.space[3],
	paddingRight: vars.space[5],
	paddingTop: vars.space[1],
	paddingBottom: vars.space[1],
});

export const name = style({
	flex: 1,
});

export const recipeTitle = style({
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
});

export const recipeNote = style({
	fontSize: vars.fontSizes.xs,
	color: vars.colors.darkBlend,
	fontStyle: 'italic',
});

export const recipeImage = style({
	selectors: {
		'&&': {
			flex: '0 0 auto',
			width: 48,
			height: 48,
			borderRadius: vars.radii.md,
		},
	},
});

export const addButton = style({
	flex: '0 0 auto',
});

export const titleIcon = style({
	marginRight: vars.space[3],
	color: vars.colors.gray70,
});

export const trigger = style({
	cursor: 'pointer',
});

export const triggerIcon = style({
	marginRight: vars.space[2],
	transition: 'transform 0.2s',
	selectors: {
		[`${trigger}[aria-expanded="true"] &`]: {
			transform: 'rotate(180deg)',
		},
	},
});
