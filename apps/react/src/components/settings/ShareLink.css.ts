import {
	vars,
	elementResetStyles,
	baseResetStyle,
	mediaQueries,
} from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-end',
	gap: vars.space[2],

	'@media': {
		[mediaQueries.md]: {
			flexDirection: 'row',
			alignItems: 'center',
		},
	},
});

export const wrapperButton = style([
	baseResetStyle,
	elementResetStyles.button,
	{
		position: 'relative',
		cursor: 'pointer',
		width: '100%',

		'@media': {
			[mediaQueries.md]: {
				width: 'auto',
			},
		},

		selectors: {
			'&::after': {
				content: 'Copy',
				position: 'absolute',
				right: vars.space[1],
				top: '50%',
				transform: 'translateY(-50%)',
				background: vars.colors.primary,
				color: vars.colors.primaryDarker,
				borderRadius: vars.radii.sm,
				padding: `${vars.space[1]} ${vars.space[2]}`,
				border: `1px solid ${vars.colors.primaryDarker}`,
			},
			'&:hover::after': {
				background: vars.colors.primaryDark,
			},
		},
	},
]);

export const input = style({
	cursor: 'pointer',
	width: '100%',
});
