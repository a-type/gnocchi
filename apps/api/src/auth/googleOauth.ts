import { google, Auth } from 'googleapis';
import { DEPLOYED_HOST } from '../config/deployedContext.js';

export const googleOauth: Auth.OAuth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_AUTH_CLIENT_ID,
	process.env.GOOGLE_AUTH_CLIENT_SECRET,
	`${DEPLOYED_HOST}/api/auth/google/callback`,
);
