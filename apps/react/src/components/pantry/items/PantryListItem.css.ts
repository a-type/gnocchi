import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const purchasedAt = style({
	justifySelf: 'end',
	marginLeft: 'auto',
	color: vars.colors.gray50,
	fontStyle: 'italic',
	fontSize: vars.fontSizes.sm,
});

export const wordBought = style({
	'@media': {
		'screen and (max-width: 600px)': {
			display: 'none',
		},
	},
});
