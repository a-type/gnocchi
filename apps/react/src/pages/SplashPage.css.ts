import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const fixedContent = style({
	display: 'flex',
	position: 'fixed',
	flexDirection: 'column',
	bottom: 0,
	backgroundColor: vars.colors.lemon,
	borderTop: `1px solid ${vars.colors.lemonDark}`,
});

export const fixedContentInner = style({
	gap: vars.space[3],
	alignItems: 'stretch',
});
