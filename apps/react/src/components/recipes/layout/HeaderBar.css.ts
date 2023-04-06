import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const fixedArea = style({
	zIndex: 10,
	top: 0,
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	gap: vars.space[3],
	padding: `${vars.space[1]} 0`,
});
