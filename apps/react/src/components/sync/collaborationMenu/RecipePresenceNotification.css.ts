import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const nowPlaying = style({
	width: '100%',
	paddingBottom: 'env(safe-area-inset-bottom, 0px)',
});

export const root = style({
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[2],
	alignItems: 'center',
	padding: vars.space[2],
});

export const titleStack = style({
	display: 'flex',
	flexDirection: 'column',
	gap: 2,
	flex: '1 1 0',
	minWidth: 0,
});

export const name = style({
	fontSize: vars.fontSizes.xxs,
});

export const title = style({
	fontSize: vars.fontSizes.xs,
	fontWeight: vars.fontWeights.bold,

	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

export const link = style({});

export const button = style({
	whiteSpace: 'nowrap',
});
