import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[2],
});

export const label = style({
	fontSize: vars.fontSizes.xs,
	fontFamily: vars.fonts.sans,
	fontWeight: 'bold',
});

export const controls = style({
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[1],
	alignItems: 'center',
});
