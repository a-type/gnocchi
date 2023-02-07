import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

export const root = style({
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: vars.space[3],
	position: 'relative',
	bottom: calc(vars.space[3]).multiply(-1).toString(),
});

export const container = style({
	backgroundColor: vars.colors.light,
	width: '100%',
	position: 'relative',
	overflow: 'hidden',
});

export const containerOpen = style({
	borderTop: `1px solid ${vars.colors.black}`,
});

export const containerScroll = style({
	overflow: 'overlay',
	height: '100%',
	marginTop: vars.space[3],
	paddingBottom: `calc(${vars.space[3]} + env(safe-area-inset-bottom, 0px))`,
});

export const toggleButton = style({
	borderRadius: '100%',
	width: 40,
	height: 40,
	padding: 0,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	touchAction: 'none',
});

export const list = style({
	padding: `${vars.space[2]} !important`,
});
