import { AppProps } from 'next/app';
import { globalCss } from 'stitches.config';

const global = globalCss({
	'html, body': {
		margin: 0,
		padding: 0,
		fontFamily: '$sans',
		fontSize: '18px',
		height: '100%',
	},

	body: {
		height: '100%',
	},

	'#__next': {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100%',
	},

	a: {
		color: 'inherit',
		textDecoration: 'none',
	},

	'*': {
		boxSizing: 'border-box',
	},
});

function MyApp({ Component, pageProps }: AppProps) {
	global();
	return <Component {...pageProps} />;
}

export default MyApp;
