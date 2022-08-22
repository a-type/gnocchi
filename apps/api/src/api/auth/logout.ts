import { Request, Response } from 'express';
import { removeTokenCookie } from '../../auth/cookies.js';

export default async function logoutHandler(req: Request, res: Response) {
	removeTokenCookie(res);
	res.writeHead(302, { Location: '/' });
	res.end();
}
