import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const list = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'start',
	width: 300,
	maxWidth: '90vw',
});

export const banner = style({
	width: '100%',
	textAlign: 'center',
	backgroundColor: vars.colors.primaryLighter,
	padding: vars.space[2],
});

export const section = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[4],
	alignItems: 'start',
	padding: vars.space[5],
	width: '100%',

	selectors: {
		'& + &': {
			borderTop: `1px solid ${vars.colors.black}`,
		},
	},
});
