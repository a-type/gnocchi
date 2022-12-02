import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const fixedContent = style({
	display: 'flex',
	position: 'fixed',
	flexDirection: 'column',
	bottom: 0,
	backgroundColor: vars.colors.primary,
	borderTop: `1px solid ${vars.colors.primaryDark}`,
});

export const fixedContentInner = style({
	gap: vars.space[3],
	alignItems: 'stretch',
});
