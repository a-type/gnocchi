import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	gap: vars.space[2],
});
