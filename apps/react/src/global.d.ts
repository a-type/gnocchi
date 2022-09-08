// /// <reference types="vite/client" />

declare module '*.sql';

declare module 'parse-fraction' {
	export default function parseFraction(str: string): [number, number];
}
