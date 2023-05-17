// @ts-ignore
import type { AppProps } from 'next/app';
import '../uno.css';

if (typeof window !== 'undefined') {
	document.body.className = 'theme-lemon';
}

export default function MyApp({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}
