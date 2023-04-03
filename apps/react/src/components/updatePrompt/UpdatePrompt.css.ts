import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const text = style({});

export const content = style({
	'@media': {
		'(min-width: 640px)': {
			minWidth: '0 !important',
			width: 'max-content !important',
			bottom: '24px !important',
			left: '24px !important',
			top: 'auto !important',
			transform: 'none !important',
		},
	},
});

export const contentInner = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[3],
	alignItems: 'flex-start',
});
