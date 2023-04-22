import { vars } from '@aglio/ui/styles';
import { keyframes, style } from '@vanilla-extract/css';

export const root = style({
	display: 'grid',
	gridTemplateAreas: `"label label label" "tools content endTools" "note note note"`,
	gridTemplateColumns: 'min-content 1fr min-content',
	gridTemplateRows: 'min-content min-content min-content',
	marginBottom: vars.space[3],
	borderRadius: vars.radii.md,
	width: '100%',
	padding: vars.space[1],

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
	width: 32,
	marginRight: vars.space[3],
});

export const endTools = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: vars.space[2],
	gridArea: 'endTools',
	width: 32,
	marginLeft: vars.space[3],
});

export const assignedToMe = style({
	backgroundColor: vars.colors.primaryWash,
	marginBottom: vars.space[2],
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
	color: vars.colors.black,
	animationName: fadeUp,
	animationDuration: '0.3s',
	animationTimingFunction: 'ease-out',
	marginBottom: vars.space[1],
});

export const noteContainer = style({
	gridArea: 'note',
	marginTop: vars.space[2],
	marginLeft: 'auto',
});

export const note = style({
	selectors: {
		'&:focus-within': {
			boxShadow: vars.shadows.focus,
		},
	},
});

export const noteEditor = style({
	padding: 0,
	margin: 0,
	border: 'none',
	background: 'none',
	width: '100%',
	fontSize: 'inherit',
	fontStyle: 'inherit',

	selectors: {
		'&:focus': {
			outline: 'none',
			background: 'none',
			boxShadow: 'none',
		},
	},
});

export const addNoteButton = style({});

export const noteIconWithNote = style({
	fill: vars.colors.primary,
	stroke: vars.colors.primaryDark,
	color: vars.colors.primaryDark,
});

export const addNoteIcon = style({
	color: vars.colors.gray70,
});
