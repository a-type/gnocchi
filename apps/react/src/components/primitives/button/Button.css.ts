import { sprinkles } from '@/styles/sprinkles.css.js';
import { vars } from '@/theme.css.js';
import { createVar, style, styleVariants } from '@vanilla-extract/css';
import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

const bgVar = createVar('button-bg');
const activeVar = createVar('button-active');

export const root = recipe({
	base: [
		sprinkles({
			px: 3,
			py: 2,
		}),
		{
			vars: {
				[bgVar]: 'transparent',
				[activeVar]: 'transparent',
			},
			backgroundColor: bgVar,
			WebkitTapHighlightColor: 'transparent',
			fontSize: vars.fontSizes.md,
			fontFamily: vars.fonts.sans,
			border: 'none',
			borderRadius: vars.radii.md,
			cursor: 'pointer',
			fontWeight: 'bold',
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			position: 'relative',
			overflow: 'visible',
			userSelect: 'none',
			transition:
				'box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out',

			selectors: {
				'&:hover:not(:disabled)': {
					boxShadow: `0 0 0 6px ${bgVar}`,
				},
				'&:focus': {
					outline: 'none',
				},
				'&:focus-visible:not(:disabled)': {
					outline: 'none',
					boxShadow: vars.shadows.focus,
				},
				'&:disabled': {
					opacity: 0.5,
				},
				'&:active:not(:disabled)': {
					boxShadow: `0 0 0 6px ${activeVar}`,
					backgroundColor: activeVar,
				},
			},
		},
	],
	variants: {
		color: {
			primary: {
				vars: {
					[bgVar]: vars.colors.primaryLighter,
					[activeVar]: vars.colors.primaryLight,
				},
				color: vars.colors.primaryDarker,
				border: `1px solid currentColor`,
				selectors: {
					'&:hover:not(:disabled)': {
						vars: {
							[bgVar]: vars.colors.primaryLight,
						},
					},
					'&:focus-visible:not(:disabled)': {
						vars: {
							[bgVar]: vars.colors.primaryLight,
						},
					},
				},
			},
			default: {
				vars: {
					[bgVar]: vars.colors.white,
				},
				color: vars.colors.black,
				border: `1px solid currentColor`,
			},
			ghost: {
				vars: {
					[bgVar]: 'transparent',
				},
				color: vars.colors.darkBlend,
				selectors: {
					'&:hover:not(:disabled)': {
						vars: {
							[bgVar]: vars.colors.grayBlend,
						},
					},
				},
			},
			destructive: {
				vars: {
					[bgVar]: vars.colors.attentionLight,
					[activeVar]: vars.colors.attentionLight,
				},
				color: vars.colors.black,
				border: `1px solid currentColor`,

				selectors: {
					'&:hover:not(:disabled)': {
						vars: {
							[bgVar]: vars.colors.attention,
						},
					},
				},
			},
			ghostDestructive: {
				vars: {
					[bgVar]: 'transparent',
					[activeVar]: vars.colors.attentionLight,
				},
				color: vars.colors.attentionDark,

				selectors: {
					'&:hover:not(:disabled)': {
						vars: {
							[bgVar]: vars.colors.attentionLight,
						},
					},
				},
			},
		},
		size: {
			default: {},
			small: {
				paddingLeft: vars.space[3],
				paddingRight: vars.space[3],
				paddingTop: vars.space[1],
				paddingBottom: vars.space[1],
				fontSize: vars.fontSizes.sm,
				borderRadius: vars.radii.lg,
			},
		},
	},

	defaultVariants: {
		color: 'default',
		size: 'default',
	},
});

export type ButtonVariants = RecipeVariants<typeof root>;
