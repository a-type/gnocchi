import { mediaQueries, vars } from '@aglio/ui/styles';
import { style, styleVariants } from '@vanilla-extract/css';

export const root = style({
	backgroundColor: vars.colors.white,
	color: vars.colors.black,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'stretch',
});

export const content = style({
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[6],
	backgroundColor: vars.colors.primary,
});

export const contentInner = style({
	maxWidth: 800,
	width: '100%',
	margin: '0 auto',
	padding: vars.space[6],
	position: 'relative',
	zIndex: 1,
});

export const mainContent = style({
	backgroundColor: vars.colors.primary,
});

export const fixedContent = style({
	display: 'flex',
	position: 'fixed',
	flexDirection: 'column',
	bottom: 0,
	backgroundColor: vars.colors.primary,
	borderTop: `1px solid ${vars.colors.primaryDark}`,
	margin: 0,
	width: '100%',
	padding: vars.space[6],
	alignItems: 'center',
	gap: vars.space[3],
	zIndex: 2,
	transition: 'background-color 0.3s ease-in-out',
});

export const fixedContentInner = style({
	gap: vars.space[3],
	alignItems: 'stretch',
	marginBottom: 0,
});

export const demoGrid = style({
	display: 'grid',
	gridTemplateColumns: '1fr',
	// gridTemplateAreas: `"title" "basicText" "basic" "recipes" "recipesText" "lists" "outroText"`,
	gridGap: vars.space[5],
	alignItems: 'flex-start',

	'@media': {
		'only screen and (min-width: 600px)': {
			// gridTemplateAreas: `"title title" "basic basicText" "recipesText recipes" "lists outroText"`,
			gridTemplateColumns: 'repeat(2, 1fr)',
		},
	},
});

export const sectionBase = style({
	backgroundColor: vars.colors.primaryLighter,
	position: 'relative',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	marginBottom: 'auto',
	padding: vars.space[6],
	borderRadius: vars.radii.lg,
	fontSize: vars.fontSizes.sm,
	border: `1px solid ${vars.colors.primaryDark}`,
	lineHeight: 1.5,
	color: vars.colors.black,
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

export const titleWrap = style({
	'@media': {
		[mediaQueries.md]: {
			gridColumnEnd: 'span 2',
		},
	},
});

export const appName = style({
	fontFamily: '"Londrina Outline", sans-serif',
	fontWeight: 500,
	fontSize: '6vmax',
	color: vars.colors.black,
	marginBottom: '20vh',
	'@media': {
		'only screen and (min-width: 600px)': {
			marginBottom: '20vh',
		},
	},
});

export const title = style({
	width: '100%',
	margin: 0,
	marginBottom: vars.space[6],
	fontFamily: vars.fonts.title,
	fontSize: '7vmax',
	color: vars.colors.black,
	fontWeight: 'black',
	textShadow: `0 0 4px ${vars.colors.white}`,

	'@media': {
		[mediaQueries.md]: {
			fontSize: '7vmin',
		},
	},
});

export const demo = style({
	position: 'relative',
	zIndex: 1,
	gridRowEnd: 'span 2',
});

export const emoji = style({
	display: 'block',
});
export const itemText = style({
	display: 'block',
	position: 'relative',
});
export const item = style({
	display: 'flex',
	alignItems: 'flex-start',
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

export const upgradeContent = style({
	backgroundColor: vars.colors.primary,
	borderTop: `20vh solid ${vars.colors.primaryLight}`,
	borderBottom: `20vh solid ${vars.colors.primaryLight}`,
});

export const upgradeSection = style({
	display: 'grid',
	gridTemplateColumns: '1fr',
	gridGap: vars.space[5],
	alignItems: 'flex-start',
	marginTop: '20vh',

	'@media': {
		'only screen and (min-width: 600px)': {
			gridTemplateColumns: 'repeat(2, 1fr)',
		},
	},
});

export const upgradeTitleWrap = style([
	titleWrap,
	{
		backgroundColor: vars.colors.primaryLighter,
		border: `1px solid ${vars.colors.primaryDark}`,
		borderRadius: vars.radii.lg,
		padding: `${vars.space[4]}`,
	},
]);

export const textOutline = style({
	textShadow: `-1px 1px ${vars.colors.white}, 1px 1px ${vars.colors.white}, 1px -1px ${vars.colors.white}, -1px -1px ${vars.colors.white}`,
});

export const upgradeTitle = style({
	fontSize: '5vmax',
});

export const upgradeCta = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'center',
	gap: vars.space[4],
	width: '100%',
	'@media': {
		[mediaQueries.md]: {
			gridColumnEnd: 'span 2',
		},
	},
});

export const endContent = style([
	content,
	{
		backgroundColor: vars.colors.primaryLight,
	},
]);

export const productHunt = style({
	marginBottom: vars.space[8],
	width: 250,
	display: 'block',

	'@media': {
		[mediaQueries.md]: {
			position: 'fixed',
			top: vars.space[4],
			right: vars.space[4],
			zIndex: 1000000,
		},
	},
});
