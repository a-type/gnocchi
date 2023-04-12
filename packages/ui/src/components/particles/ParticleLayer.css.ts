import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const canvas = style({
	position: 'fixed',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	width: '100%',
	height: '100%',
	zIndex: vars.zIndices.overdraw,
	pointerEvents: 'none',
});
