import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const purchasedAt = style({
	justifySelf: 'flex-end',
	marginLeft: 'auto',
	color: vars.colors.gray50,
	fontStyle: 'italic',
	fontSize: vars.fontSizes.sm,
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	gap: vars.space[2],
});

export const wordBought = style({
	'@media': {
		'screen and (max-width: 600px)': {
			display: 'none',
		},
	},
});

export const mainContent = style({
	paddingLeft: vars.space[2],
});
