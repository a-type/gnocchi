import { Request, Response } from 'express';
import { setReturnToCookie } from '../../../auth/cookies';
import { googleOauth } from '../../../auth/googleOauth';

export default async function googleLoginHandler(req: Request, res: Response) {
	setReturnToCookie(req, res);

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
