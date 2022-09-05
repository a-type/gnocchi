export const API_ORIGIN = process.env.API_ORIGIN || 'localhost:3001';
export const SECURE =
	typeof window !== 'undefined' && window.location.protocol === 'https:';
export const API_HOST_HTTP = (SECURE ? 'https://' : 'http://') + API_ORIGIN;
export const API_HOST_WS = (SECURE ? 'wss://' : 'ws://') + API_ORIGIN;
