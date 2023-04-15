import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const content = style({
	backgroundColor: `${vars.colors.primaryWash} !important`,
	display: 'flex',
});

export const innerContent = style({
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[3],
	alignItems: 'center',
});

export const arrow = style({
	fill: `${vars.colors.primaryWash} !important`,
});
