import { vars } from '@aglio/ui';
import { keyframes, style } from '@vanilla-extract/css';

export const root = style({
	display: 'grid',
	gridTemplateAreas: `"label label" "tools content"`,
	gridTemplateColumns: 'min-content 1fr',
	gridTemplateRows: 'min-content min-content',
	gap: vars.space[3],
	marginBottom: vars.space[1],
	borderRadius: vars.radii.md,
	width: '100%',
	// padding: vars.space[2],

	transition: `background-color 0.2s ease-out, color 0.2s ease-out`,
});

export const completed = style({
	opacity: 0.6,
});

export const tools = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: vars.space[2],
	gridArea: 'tools',
});

export const assignedToMe = style({
	backgroundColor: vars.colors.primaryWash,
});

export const content = style({
	gridArea: 'content',
});

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

export const label = style({
	gridArea: 'label',
	fontSize: vars.fontSizes.xs,
	fontStyle: 'italic',
	color: vars.colors.primaryDarker,
	animationName: fadeUp,
	animationDuration: '0.3s',
	animationTimingFunction: 'ease-out',
});
