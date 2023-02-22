import { sprinkles } from '../../styles/sprinkles.css.js';
import { vars } from '../../theme.css.js';
import { createVar } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

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
			gap: vars.space[1],
			alignItems: 'center',
			position: 'relative',
			overflow: 'visible',
			userSelect: 'none',
			transition:
				'box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out',
			whiteSpace: 'nowrap',

			selectors: {
				'&:hover:not(:disabled):not([data-disabled="true"])': {
					backgroundColor: hoverVar,
					boxShadow: `0 0 0 6px ${hoverVar}`,
				},
				'&:focus': {
					outline: 'none',
				},
				'&:focus-visible:not(:disabled):not([data-disabled="true"])': {
					outline: 'none',
					boxShadow: vars.shadows.focus,
				},
				'&:disabled': {
					opacity: 0.5,
					cursor: 'default',
				},
				'&[data-disabled="true"]': {
					opacity: 0.5,
					cursor: 'default',
				},
				'&:active:not(:disabled):not([data-disabled="true"])': {
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
					// '&:hover:not(:disabled):not([data-disabled="true"])': {
					// 	vars: {
					// 		[bgVar]: vars.colors.primaryLight,
					// 	},
					// },
					'&:focus-visible:not(:disabled):not([data-disabled="true"])': {
						vars: {
							[bgVar]: vars.colors.primaryLight,
						},
					},
				},
			},
			accent: {
				vars: {
					[bgVar]: vars.colors.accentLighter,
					[hoverVar]: vars.colors.accentLight,
					[activeVar]: vars.colors.accentLight,
				},
				color: vars.colors.accentDarker,
				border: `1px solid currentColor`,
				selectors: {
					'&:focus-visible:not(:disabled):not([data-disabled="true"])': {
						vars: {
							[bgVar]: vars.colors.accentLight,
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
					[hoverVar]: vars.colors.grayBlend,
					[activeVar]: vars.colors.grayDarkBlend,
				},
				color: vars.colors.darkBlend,
				selectors: {
					'&:hover:not(:disabled):not([data-disabled="true"])': {
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
					'&:hover:not(:disabled):not([data-disabled="true"])': {
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
					// '&:hover:not(:disabled):not([data-disabled="true"])': {
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
					'&:hover:not(:disabled):not([data-disabled="true"])': {
						filter: 'brightness(1.1)',
					},
				},
			},
		},
		align: {
			start: {
				alignSelf: 'flex-start',
			},
			stretch: {
				alignSelf: 'stretch',
			},
			end: {
				alignSelf: 'flex-end',
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
