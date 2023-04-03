import { vars } from '../../styles/theme.css.js';
import { style } from '@vanilla-extract/css';

export const form = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[2],
	alignItems: 'flex-start',
});
