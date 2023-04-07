import { mediaQueries } from '../../styles/media.js';
import { sprinkles } from '../../styles/sprinkles.css.js';
import { vars } from '../../styles/theme.css.js';
import { style } from '@vanilla-extract/css';

export const root = style([
	sprinkles({
		px: 3,
		py: 2,
	}),
	{
		fontSize: vars.fontSizes.md,
		fontFamily: vars.fonts.sans,
		borderRadius: vars.radii.md,
		backgroundColor: vars.colors.grayBlend,
		userSelect: 'auto',
		minWidth: 60,
		color: vars.colors.black,

		border: `1px solid ${vars.colors.gray90}`,

		selectors: {
			'&:focus': {
				outline: 'none',
				backgroundColor: vars.colors.gray30,
			},
			'&:focus-visible': {
				outline: 'none',
				boxShadow: vars.shadows.focus,
			},
		},

		'@media': {
			[mediaQueries.md]: {
				minWidth: 120,
			},
		},
	},
]);
