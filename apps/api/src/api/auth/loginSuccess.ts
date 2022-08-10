import { Request, Response } from 'express';
import { getReturnToCookie, removeReturnToCookie } from '../../auth/cookies';

export default async function loginSuccessHandler(req: Request, res: Response) {
	// read returnTo cookie to see if we have a redirect,
	// otherwise redirect to /dashboard

	const returnTo = getReturnToCookie(req) || '/dashboard';

	// remove the cookie
	removeReturnToCookie(res);

	// redirect to returnTo
	res.writeHead(302, { Location: returnTo });
	res.end();
}
