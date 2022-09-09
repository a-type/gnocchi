import { Request, Response } from 'express';
import { setInviteIdCookie, setReturnToCookie } from '@aglio/auth';
import { googleOauth } from '../../../auth/googleOauth.js';

export default async function googleLoginHandler(req: Request, res: Response) {
	setReturnToCookie(req, res);
	setInviteIdCookie(req, res);

	const authorizationUrl = googleOauth.generateAuthUrl({
		access_type: 'online',
		scope: [
			'https://www.googleapis.com/auth/userinfo.email',
			'https://www.googleapis.com/auth/userinfo.profile',
		],
		include_granted_scopes: true,
	});

	res.writeHead(302, { Location: authorizationUrl }).end();
}
