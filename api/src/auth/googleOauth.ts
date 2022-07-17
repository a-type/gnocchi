import { google } from 'googleapis';
import { DEPLOYED_HOST } from '../config/deployedContext';

export const googleOauth = new google.auth.OAuth2(
	process.env.GOOGLE_AUTH_CLIENT_ID,
	process.env.GOOGLE_AUTH_CLIENT_SECRET,
	`${DEPLOYED_HOST}/api/auth/google/callback`,
);
