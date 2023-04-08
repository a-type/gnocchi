import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	flexWrap: 'wrap',
	gap: vars.space[2],
});

export const tag = style({
	display: 'inline-flex',
	flexDirection: 'row',
	alignItems: 'center',
	whiteSpace: 'nowrap',
	gap: vars.space[1],
	padding: `${vars.space[1]} ${vars.space[3]}`,
	borderRadius: vars.radii.lg,
	border: `1px solid ${vars.colors.black}`,
	fontSize: vars.fontSizes.sm,
});

export const removeButton = style({
	padding: 2,
});
