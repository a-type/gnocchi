import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	border: `1px solid ${vars.colors.black}`,
	borderRadius: vars.radii.lg,
	overflow: 'hidden',
});

export const image = style({
	width: '100%',
	height: 'auto',
	objectFit: 'cover',
});
