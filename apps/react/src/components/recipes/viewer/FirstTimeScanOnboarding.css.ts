import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	backgroundColor: vars.colors.accentLighter,
	color: vars.colors.accentDarker,
	padding: vars.space[4],
	borderRadius: vars.radii.lg,
});
