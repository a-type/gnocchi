import { style } from '@vanilla-extract/css';

export const itemText = style({
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	maxWidth: '100%',
});
