import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'center',
	pointerEvents: 'none',
	position: 'relative',
	width: 32,
	height: 32,
});

export const container = style({
	position: 'absolute',
	left: 'calc(50% - 32px)',
	transform: 'translateX(-100%)',
	padding: vars.space[3],
	borderRadius: vars.radii.lg,
	backgroundColor: vars.colors.white,
	border: `1px solid ${vars.colors.gray80}`,
	whiteSpace: 'nowrap',
	boxShadow: vars.shadows.lg,
	userSelect: 'none',
	pointerEvents: 'none',
});
