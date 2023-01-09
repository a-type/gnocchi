export const API_ORIGIN =
	(import.meta as any).env.VITE_API_ORIGIN || 'localhost:3001';
export const SECURE =
	typeof window !== 'undefined' && window.location.protocol === 'https:';
export const API_HOST_HTTP = (SECURE ? 'https://' : 'http://') + API_ORIGIN;
