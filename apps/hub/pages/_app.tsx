import { lemonTheme } from '@aglio/ui';
import type { AppProps } from 'next/app';

if (typeof window !== 'undefined') {
	document.body.className = lemonTheme;
}

export default function MyApp({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}
