import { style } from '@vanilla-extract/css';
import { mediaQueries } from '../../styles/media.js';
import { vars } from '../../theme.css.js';

export const nowPlaying = style({
	backgroundColor: vars.colors.light,
	padding: 2,
	borderRadius: vars.radii.xl,
	borderStyle: vars.borderStyles.solid,
	borderWidth: vars.borderWidths.default,
	borderColor: vars.colors.gray50,
	boxShadow: vars.shadows.md,
	minWidth: 32,
	alignItems: 'center',
	justifyContent: 'center',
});
