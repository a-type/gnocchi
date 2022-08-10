export const API_ORIGIN = process.env.API_ORIGIN || 'localhost:3001';
export const SECURE =
	typeof window !== 'undefined' && window.location.protocol === 'https:';
