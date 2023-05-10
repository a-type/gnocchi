import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: vars.space[2],
	paddingRight: vars.space[2],
});

export const recipeLink = style({
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[2],
	alignItems: 'center',
	padding: vars.space[2],
	width: '100%',
	overflow: 'hidden',
});

export const recipeImage = style({
	width: 40,
	height: 40,
	borderRadius: vars.radii.md,
	objectFit: 'cover',
	flexShrink: 0,
});

export const recipeTitle = style({
	fontWeight: 'bold',
	maxWidth: '100%',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	fontSize: vars.fontSizes.sm,
});

export const pieProgress = style({
	width: 32,
	height: 32,
	flexShrink: 0,
	borderRadius: '100%',
	overflow: 'hidden',
	border: `1px solid ${vars.colors.gray70}`,
});

export const pieProgressBackground = style({
	fill: vars.colors.gray20,
});

export const pieProgressForeground = style({
	stroke: vars.colors.primary,
	strokeWidth: 32,
	transform: 'rotate(270deg)',
	transformOrigin: 'center',
});

export const pieProgressComplete = style({
	fill: vars.colors.accent,
});

export const pieProgressCheck = style({
	stroke: vars.colors.white,
	strokeWidth: 2,
});
