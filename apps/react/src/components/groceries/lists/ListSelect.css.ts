import { style } from '@vanilla-extract/css';
import { vars } from '@aglio/ui';

export const itemText = style({
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	maxWidth: '100%',
});

export const filledIcon = style({
	fill: `${vars.colors.primary} !important`,
});
