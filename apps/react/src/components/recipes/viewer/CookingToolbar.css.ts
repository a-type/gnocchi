import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

export const root = style({
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	position: 'relative',
	bottom: calc(vars.space[1]).multiply(-1).toString(),
});

export const actions = style({
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[2],
	marginBottom: vars.space[3],
});

export const container = style({
	backgroundColor: vars.colors.white,
	width: '100%',
	position: 'relative',
	overflow: 'hidden',
	borderRadius: vars.radii.lg,
});

export const containerOpen = style({
	border: `1px solid ${vars.colors.black}`,
});

export const containerScroll = style({
	overflow: 'overlay',
	height: '100%',
	marginTop: vars.space[3],
	paddingBottom: `calc(${vars.space[10]} + env(safe-area-inset-bottom, 0px))`,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	paddingLeft: vars.space[1],
	paddingRight: vars.space[1],
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

export const multiplier = style({
	marginBottom: vars.space[2],
});

export const nowPlaying = style({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	backgroundColor: vars.colors.white,
	borderRadius: vars.radii.lg,
	boxShadow: vars.shadows.lg,
	border: `1px solid ${vars.colors.gray70}`,
});
