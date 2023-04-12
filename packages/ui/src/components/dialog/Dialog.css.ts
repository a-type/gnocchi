import { mediaQueries } from '../../styles/media.js';
import { vars } from '../../styles/theme.css.js';
import { keyframes, style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';
import { recipe } from '@vanilla-extract/recipes';

const overlayShow = keyframes({
	'0%': { opacity: 0 },
	'100%': { opacity: 1 },
});

const contentShowMobile = keyframes({
	'0%': { opacity: 0, transform: 'translate(0, 80vh) scale(.96)' },
	'100%': { opacity: 1, transform: 'translate(0, 0) scale(1)' },
});

const overlayHide = keyframes({
	'0%': { opacity: 1 },
	'100%': { opacity: 0 },
});

const contentHideMobile = keyframes({
	'0%': { opacity: 1, transform: 'translate(0, 0) scale(1)' },
	'100%': { opacity: 0, transform: 'translate(0, 80vh) scale(.96)' },
});

export const overlay = style({
	backgroundColor: vars.colors.overlay,
	position: 'fixed',
	inset: 0,
	zIndex: calc(vars.zIndices.dialog).subtract(1).toString(),
	'@media': {
		'(prefers-reduced-motion: no-preference)': {
			animation: `${overlayShow} 200ms cubic-bezier(0.16, 1, 0.3, 1)`,

			selectors: {
				'&[data-state="closed"]': {
					animation: `${overlayHide} 200ms cubic-bezier(0.16, 1, 0.3, 1)`,
				},
			},
		},
	},
});

export const content = recipe({
	base: {
		zIndex: vars.zIndices.dialog,
		position: 'fixed',

		bottom: 'var(--viewport-bottom-offset, 0px)',
		left: 0,
		right: 0,
		height: 'min-content',
		maxHeight: 'calc(0.85 * var(--viewport-height, 100vh))',

		transform: 'translate(0, 0, 0)',

		boxShadow: vars.shadows.xl,

		backgroundColor: vars.colors.white,
		borderTopLeftRadius: vars.radii.lg,
		borderTopRightRadius: vars.radii.lg,
		padding: vars.space[6],
		border: `1px solid ${vars.colors.black}`,
		borderBottom: 'none',
		overflowY: 'auto',
		display: 'flex',
		flexDirection: 'column',
		paddingBottom: `calc(${vars.space[6]} + env(safe-area-inset-bottom, 0px))`,

		'@media': {
			[mediaQueries.sm]: {
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				width: '90vw',
				maxWidth: '450px',
				maxHeight: '85vh',
				paddingBottom: vars.space[6],
				borderRadius: vars.radii.lg,
				borderBottom: `1px solid ${vars.colors.black}`,
			},
			'(prefers-reduced-motion: no-preference)': {
				animation: `${contentShowMobile} 200ms cubic-bezier(0.16, 1, 0.3, 1)`,
				selectors: {
					'&[data-state="closed"]': {
						animation: `${contentHideMobile} 200ms cubic-bezier(0.16, 1, 0.3, 1)`,
					},
				},
			},
		},

		selectors: {
			'&:focus, &:focus-visible': {
				outline: 'none',
			},
		},
	},

	variants: {
		width: {
			lg: {
				'@media': {
					[mediaQueries.md]: {
						maxWidth: '800px',
					},
				},
			},
			md: {
				maxWidth: '600px',
			},
		},
	},
});

export const title = style({
	fontFamily: vars.fonts.title,
	color: vars.colors.black,
	fontSize: vars.fontSizes['3xl'],
	marginBottom: vars.space[4],
	marginTop: 0,
});

export const description = style({
	margin: '10px 0 20px',
	color: vars.colors.gray80,
	fontSize: vars.fontSizes.md,
	lineHeight: 1.5,
});

export const actions = style({
	display: 'flex',
	justifyContent: 'flex-end',
	position: 'sticky',
	bottom: 0,
	width: '100%',
	gap: vars.space[3],
	alignItems: 'center',
	backgroundColor: vars.colors.white,
	paddingBottom: vars.space[3],
	paddingTop: vars.space[3],
	transform: `translateY(${vars.space[6]})`,
	flexWrap: 'wrap',
});
