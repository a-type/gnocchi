import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const root = style({
	width: '100%',
	height: '100%',
	overflow: 'hidden',
	borderRadius: vars.radii.lg,
	objectFit: 'cover',
});
