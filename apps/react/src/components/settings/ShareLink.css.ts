import { vars, elementResetStyles, baseResetStyle } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const wrapperButton = style([
	baseResetStyle,
	elementResetStyles.button,
	{
		position: 'relative',
		cursor: 'pointer',

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
});
