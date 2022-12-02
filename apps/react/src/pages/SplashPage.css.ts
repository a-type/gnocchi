import { vars } from '@/theme.css.js';
import { style, styleVariants } from '@vanilla-extract/css';

export const fixedContent = style({
	display: 'flex',
	position: 'fixed',
	flexDirection: 'column',
	bottom: 0,
	backgroundColor: vars.colors.primary,
	borderTop: `1px solid ${vars.colors.primaryDark}`,
});

export const fixedContentInner = style({
	gap: vars.space[3],
	alignItems: 'stretch',
});

export const demoGrid = style({
	display: 'grid',
	gridTemplateColumns: '1fr',
	gridTemplateAreas: `"title" "basicText" "basic" "multiplayerText" "multiplayer" "lists" "outroText"`,
	gridGap: vars.space[3],
	marginTop: '30vh',
	marginBottom: '80vh',
	alignItems: 'start',

	'@media': {
		'only screen and (min-width: 600px)': {
			marginTop: '40vh',
			gridTemplateAreas: `"title title" "basic basicText" "multiplayerText multiplayer" "lists outroText"`,
			gridTemplateColumns: 'repeat(2, 1fr)',
		},
	},
});

export const sectionBase = style({
	backgroundColor: vars.colors.primary,
	position: 'relative',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'start',
	marginBottom: 'auto',
	padding: vars.space[6],
	borderRadius: vars.radii.lg,
	fontSize: vars.fontSizes.sm,
	border: `1px solid ${vars.colors.primaryDark}`,
});

export const section = styleVariants({
	default: [sectionBase],
	white: [
		sectionBase,
		{
			backgroundColor: vars.colors.white,
			border: `1px solid ${vars.colors.black}`,
		},
	],
});

export const backgroundSceneContainer = style({
	position: 'fixed',
	top: 0,
	left: 0,
	width: '100%',
	height: '80%',
	pointerEvents: 'none',
});

export const title = style({
	gridArea: 'title',
	margin: 0,
	fontFamily: '"Londrina Outline", sans-serif',
	fontSize: '15vmax',
	color: vars.colors.black,
	fontWeight: 'lighter',
});

export const demo = style({});

export const emoji = style({
	display: 'block',
});
export const itemText = style({
	display: 'block',
	position: 'relative',
});
export const item = style({
	display: 'flex',
	alignItems: 'start',
	gap: vars.space[2],
});

export const beta = style({
	// position: 'absolute',
	// top: vars.space[2],
	// right: vars.space[2],
	// transform: 'translate(90%, -90%)',
	fontSize: vars.fontSizes.xs,
	color: vars.colors.white,
	backgroundColor: vars.colors.accent,
	padding: vars.space[1],
	borderRadius: vars.radii.sm,
});
