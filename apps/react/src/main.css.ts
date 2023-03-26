import { globalStyle } from '@vanilla-extract/css';

globalStyle('body', {
	'@media': {
		'(display-mode: standalone)': {
			overscrollBehavior: 'none',
		},
	},
});
