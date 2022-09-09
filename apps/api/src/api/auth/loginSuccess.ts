import { Request, Response } from 'express';
import { UI_ORIGIN } from 'src/config/deployedContext.js';
import { URL } from 'url';
import { getReturnToCookie, removeReturnToCookie } from '@aglio/auth';

export default async function loginSuccessHandler(req: Request, res: Response) {
	// read returnTo cookie to see if we have a redirect,
	// otherwise redirect to /

	const returnTo = getReturnToCookie(req) || '/';

	// remove the cookie
	removeReturnToCookie(res);

	const returnToUrl = new URL(returnTo, UI_ORIGIN);

	// redirect to returnTo
	res.writeHead(302, { Location: returnToUrl.toString() });
	res.end();
}
