import { style } from '@vanilla-extract/css';
import { vars } from '../../theme.css.js';

export const section = style({
	background: vars.colors.white,
	borderRadius: vars.radii.lg,
	borderStyle: vars.borderStyles.solid,
	borderWidth: vars.borderWidths.default,
	borderColor: vars.colors.black,
	padding: vars.space[4],
	width: '100%',
	maxWidth: '80vw',
	'@media': {
		'(max-width: 640px)': {
			minWidth: 'auto',
		},
	},
});

export const sectionGrid = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
	gap: vars.space[4],
	alignItems: 'flex-start',
});
