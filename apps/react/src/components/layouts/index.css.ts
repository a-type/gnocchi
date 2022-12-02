import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const fixedArea = style({
	position: 'sticky',
	top: 0,
	zIndex: 1,
	backgroundColor: vars.colors.light,
	width: '100%',
	padding: vars.space[4],
	alignItems: 'stretch',
	gap: vars.space[2],
});

export const content = style({
	gridArea: 'content',
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	overflowX: 'hidden',
	position: 'relative',
	paddingLeft: vars.space[4],
	paddingRight: vars.space[4],
	paddingTop: vars.space[6],
	paddingBottom: vars.space[6],
});

export const contentNoPadding = style({
	paddingLeft: 0,
	paddingRight: 0,
	paddingTop: 0,
	paddingBottom: 0,
});

export const innerContent = style({
	width: '100%',
	maxWidth: vars.sizes.content,
	flexDirection: 'column',
});
export const innerContentFullHeight = style({
	flex: 1,
});

export const pageRoot = style({
	display: 'grid',
	gridTemplateAreas: '"content" "nowPlaying"',
	gridTemplateRows: '1fr auto',
	flex: '1 1 0',
	minHeight: 0,
});

export const pageRootLemon = style({
	backgroundColor: vars.colors.primary,
});
