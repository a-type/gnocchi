import { IncomingMessage } from 'http';
import { assert } from '@aglio/tools';
import { MAX_AGE, setTokenCookie, getTokenCookie } from './cookies.js';
import { Session } from './session.js';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

export type { Session } from './session.js';
export {
	getInviteIdCookie,
	getReturnToCookie,
	getTokenCookie,
	setInviteIdCookie,
	setReturnToCookie,
	setTokenCookie,
	removeInviteIdCookie,
	removeReturnToCookie,
	removeTokenCookie,
} from './cookies.js';
export * from './subscription.js';
export * from './join.js';

const SESSION_SECRET = process.env.SESSION_SECRET;
assert(SESSION_SECRET, 'SESSION_SECRET environment variable must be set');

export async function setLoginSession(res: Response, session: Session) {
	// create a session object with a max age we can validate later
	const sessionObject = {
		sub: session.userId,
		iat: Date.now(),
		pid: session.planId,
		nam: session.name,
	};
	const token = jwt.sign(sessionObject, SESSION_SECRET!, {
		expiresIn: MAX_AGE,
	});

	setTokenCookie(res, token);
}

export async function getLoginSession(
	req: IncomingMessage,
): Promise<Session | null> {
	const token = getTokenCookie(req);

	if (!token) return null;

	const data = jwt.verify(token, SESSION_SECRET!) as {
		sub: string;
		iat: number;
		pid: string;
		nam: string | null;
	};

	return {
		userId: data.sub,
		planId: data.pid,
		name: data.nam,
	};
}

export async function authenticatedProfile(req: IncomingMessage) {
	try {
		const session = await getLoginSession(req);

		if (!session) {
			return null;
		}

		return session;
	} catch (e) {
		return null;
	}
}
