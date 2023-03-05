import { mediaQueries, vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'grid',
	gridTemplateColumns: '1fr',
	gridTemplateRows: 'auto auto',
	gridTemplateAreas: '"image" "title"',
	gap: vars.space[4],
	width: '100%',
	alignItems: 'stretch',

	'@media': {
		[mediaQueries.lg]: {
			gridTemplateColumns: '1fr auto',
			gridTemplateRows: '1fr',
			gridTemplateAreas: '"title image"',
			gap: vars.space[4],
			alignItems: 'flex-start',
		},
	},
});

export const title = style({
	gridArea: 'title',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	gap: vars.space[4],
	minWidth: 300,
});

export const image = style({
	gridArea: 'image',
	width: '100%',
	height: '300px',

	'@media': {
		[mediaQueries.lg]: {
			width: 200,
			height: 200,
		},
	},
});
