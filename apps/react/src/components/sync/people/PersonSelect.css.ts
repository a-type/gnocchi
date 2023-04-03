import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const item = style({
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[2],
	alignItems: 'center',
});

export const trigger = style({
	border: 'none',
	padding: 0,
	borderRadius: '100%',

	selectors: {
		'&[data-state="open"]': {
			transform: 'scale(1.05)',
		},
	},
});
