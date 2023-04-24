import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const fileInput = style({
	opacity: 0,
	position: 'absolute',
	zIndex: -1,
	selectors: {
		'&::-webkit-file-upload-button': {
			visibility: 'hidden',
		},
	},
});

export const fileInputLabel = style({});

export const list = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'stretch',
	padding: 0,
	margin: 0,
	gap: vars.space[2],
});

export const item = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	padding: vars.space[2],
	gap: vars.space[2],
});

export const itemTitle = style({
	flex: 1,
	fontWeight: vars.fontWeights.bold,
});
