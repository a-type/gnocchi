import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	marginBottom: vars.space[6],
});

export const title = style({
	selectors: {
		'&&': {
			fontSize: vars.fontSizes.md,
		},
	},
});

export const list = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[3],
});

export const item = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[2],
	padding: vars.space[3],
	borderRadius: vars.radii.lg,
	backgroundColor: vars.colors.white,
	border: `1px solid ${vars.colors.gray60}`,
});

export const itemContent = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'flex-start',
	gap: vars.space[2],
});

export const itemText = style({
	flex: 1,
});

export const dateStack = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[1],
	fontSize: vars.fontSizes.sm,
});

export const purchasedAt = style({
	color: vars.colors.gray80,
});

export const expiresAt = style({
	marginLeft: 'auto',
	color: vars.colors.attentionDark,
});

export const itemActions = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	width: '100%',
	gap: vars.space[2],
	flexWrap: 'wrap',
});

export const itemFoodInfo = style({
	marginLeft: 'auto',
});
