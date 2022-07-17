// /// <reference types="vite/client" />

declare module '*.sql';

declare module 'parse-fraction' {
	export default function parseFraction(str: string): [number, number];
}

declare var process: {
	env: {
		NODE_ENV: string;
		PUBLIC_URL: string;
		API_ORIGIN?: string;
	};
};
