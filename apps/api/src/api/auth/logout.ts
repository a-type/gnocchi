import { Request, Response } from 'express';
import { UI_ORIGIN } from 'src/config/deployedContext.js';
import { removeTokenCookie } from '../../auth/cookies.js';

export default async function logoutHandler(req: Request, res: Response) {
	removeTokenCookie(res);
	res.writeHead(302, { Location: UI_ORIGIN });
	res.end();
}
