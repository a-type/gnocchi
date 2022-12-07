import { sprinkles } from '@/styles/sprinkles.css.js';
import { vars } from '@/theme.css.js';
import { createVar, style, styleVariants } from '@vanilla-extract/css';
import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

const bgVar = createVar('button-bg');
const hoverVar = createVar('button-hover');
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
				[hoverVar]: 'transparent',
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
					backgroundColor: hoverVar,
					boxShadow: `0 0 0 6px ${hoverVar}`,
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
					[hoverVar]: vars.colors.primaryLight,
					[activeVar]: vars.colors.primaryLight,
				},
				color: vars.colors.primaryDarker,
				border: `1px solid currentColor`,
				selectors: {
					// '&:hover:not(:disabled)': {
					// 	vars: {
					// 		[bgVar]: vars.colors.primaryLight,
					// 	},
					// },
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
					[hoverVar]: vars.colors.gray20,
					[activeVar]: vars.colors.gray30,
				},
				color: vars.colors.black,
				border: `1px solid currentColor`,
			},
			ghost: {
				vars: {
					[bgVar]: 'transparent',
					[hoverVar]: vars.colors.gray10,
					[activeVar]: vars.colors.gray20,
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
					[hoverVar]: vars.colors.attentionLight,
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
					[hoverVar]: vars.colors.attentionLight,
					[activeVar]: vars.colors.attentionLight,
				},
				color: vars.colors.attentionDark,

				selectors: {
					// '&:hover:not(:disabled)': {
					// 	vars: {
					// 		[bgVar]: vars.colors.attentionLight,
					// 	},
					// },
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
		toggled: {
			true: {
				backgroundColor: activeVar,
				selectors: {
					'&:hover:not(:disabled)': {
						filter: 'brightness(1.1)',
					},
				},
			},
		},
	},

	compoundVariants: [
		{
			variants: {
				color: 'ghost',
				toggled: true,
			},
			style: {
				backgroundColor: vars.colors.primaryLighter,
			},
		},
	],

	defaultVariants: {
		color: 'default',
		size: 'default',
	},
});

export type ButtonVariants = RecipeVariants<typeof root>;