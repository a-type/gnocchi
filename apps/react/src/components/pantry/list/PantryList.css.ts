import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'stretch',
});

export const empty = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	textAlign: 'center',
	width: '100%',
	padding: vars.space[8],
	opacity: 0.7,
});

export const expiresSoon = style({});
