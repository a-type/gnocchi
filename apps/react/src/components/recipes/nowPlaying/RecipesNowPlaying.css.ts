import { vars } from '@aglio/ui/styles';
import { keyframes, style } from '@vanilla-extract/css';

const fadeUp = keyframes({
	from: {
		opacity: 0,
		transform: 'translateY(32px)',
	},
	to: {
		opacity: 1,
		transform: 'translateY(0)',
	},
});

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	width: '100%',
	backgroundColor: vars.colors.white,
	borderRadius: vars.radii.lg,
	boxShadow: vars.shadows.lg,
	border: `1px solid ${vars.colors.gray70}`,
	overflow: 'hidden',
	animation: `${fadeUp} 0.3s ease-out`,
});

export const label = style({
	padding: `${vars.space[1]} ${vars.space[2]}`,
});

export const list = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[2],
});

export const actions = style({
	padding: vars.space[2],
});

export const collapsible = style({
	width: '100%',
});

export const topBar = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'space-between',
	width: '100%',
	paddingRight: vars.space[5],
});

export const collapseIcon = style({
	transition: 'transform 0.2s ease-in-out',
	selectors: {
		'[data-state="closed"] &': {
			transform: 'rotate(180deg)',
		},
	},
});

export const inner = style({
	width: '100%',
});
