export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'localhost:3001';
export const SECURE =
	typeof window !== 'undefined' && window.location.protocol === 'https:';
export const API_HOST_HTTP = (SECURE ? 'https://' : 'http://') + API_ORIGIN;
export const API_HOST_WS = (SECURE ? 'wss://' : 'ws://') + API_ORIGIN;
export const UI_HOST_HTTP = import.meta.env.VITE_PUBLIC_URL;
console.log(import.meta.env.VITE_PUBLIC_URL);
