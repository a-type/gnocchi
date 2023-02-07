import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const tagsList = style({
	display: 'flex',
	flexWrap: 'wrap',
	gap: '0.5rem',
	margin: '0.5rem 0',
});

export const tagButton = style({
	display: 'flex',
	alignItems: 'center',
	gap: vars.space[1],
});
