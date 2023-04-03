import { mediaQueries, vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const topLineRoot = style({
	display: 'grid',
	gridTemplateAreas: '"image" "title"',
	gridTemplateColumns: '1fr',
	gridTemplateRows: 'auto 1fr',
	marginBottom: vars.space[6],
	gap: vars.space[4],

	'@media': {
		[mediaQueries.lg]: {
			gridTemplateAreas: '"title image"',
			gridTemplateColumns: 'auto minmax(min-content, 1fr)',
		},
	},
});

export const topLineImage = style({
	gridArea: 'image',
	width: '100%',
	height: '30vh',

	'@media': {
		[mediaQueries.lg]: {
			width: '100%',
			minWidth: '200px',
			height: '200px',
		},
	},
});

export const topLineTitle = style({
	gridArea: 'title',
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[2],
});
