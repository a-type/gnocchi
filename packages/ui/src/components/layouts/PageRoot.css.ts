import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css.js';

export const pageRoot = style({
	display: 'grid',
	flex: '1 1 0',
	// minHeight: 0,
	gridTemplateAreas: '"content" "nowPlaying"',
	gridTemplateRows: '1fr auto',
	gridTemplateColumns: '1fr',
});

export const pageRootLemon = style({
	backgroundColor: vars.colors.primary,
});
