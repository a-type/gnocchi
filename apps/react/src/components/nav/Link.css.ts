import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const root = style({
	selectors: {
		'&[data-transitioning="true"]': {
			opacity: 0.7,
		},
	},
});

export const textLink = style({
	fontWeight: 'bold',
	cursor: 'pointer',
	fontSize: 'inherit',
	color: vars.colors.gray90,
});
