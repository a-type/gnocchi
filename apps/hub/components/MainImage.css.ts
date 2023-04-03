import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'block',
	position: 'relative',
	width: '100%',
	height: '30vh',
	borderRadius: vars.radii.lg,
	overflow: 'hidden',
});

export const img = style({
	objectFit: 'cover',
	objectPosition: 'center',
});
