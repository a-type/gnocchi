import { mediaQueries, vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const grid = style({
	display: 'grid',
	gridTemplateColumns: '1fr',
	gap: vars.space[3],

	'@media': {
		[mediaQueries.md]: {
			gridTemplateColumns: '1fr 1fr',
		},
	},
});
