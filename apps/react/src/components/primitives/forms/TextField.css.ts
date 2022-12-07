import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const fieldGroup = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'stretch',
	gap: vars.space[1],
	minWidth: 120,
	alignSelf: 'stretch',
});

export const fieldLabel = style({
	display: 'inline-flex',
	flexDirection: 'column',
	gap: vars.space[1],
	fontSize: vars.fontSizes.sm,
	fontWeight: 'bold',
	color: vars.colors.darkBlend,
	marginBottom: vars.space[1],
});
