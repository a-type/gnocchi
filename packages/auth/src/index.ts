import { IncomingMessage } from 'http';
import { assert } from '@aglio/tools';
import {
	MAX_AGE,
	setSessionCookie,
	getTokenCookie,
	setTemporaryAccessCookie,
	getTemporaryAccessCookie,
} from './cookies.js';
import { Session, TemporaryAccessSession } from './session.js';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

export type { Session } from './session.js';
export {
	getInviteIdCookie,
	getReturnToCookie,
	getTokenCookie,
	setInviteIdCookie,
	setReturnToCookie,
	setSessionCookie as setTokenCookie,
	removeInviteIdCookie,
	removeReturnToCookie,
	removeSessionCookie as removeTokenCookie,
} from './cookies.js';
export * from './subscription.js';
export * from './join.js';
export * from './login.js';

const SESSION_SECRET = process.env.SESSION_SECRET;
assert(SESSION_SECRET, 'SESSION_SECRET environment variable must be set');

export async function setLoginSession(res: Response, session: Session) {
	// create a session object with a max age we can validate later
	const sessionObject = {
		sub: session.userId,
		iat: Date.now(),
		pid: session.planId,
		nam: session.name,
		role: session.role,
		pad: session.isProductAdmin,
	};
	const token = jwt.sign(sessionObject, SESSION_SECRET!, {
		expiresIn: MAX_AGE,
	});

	setSessionCookie(res, token);
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
		role: 'admin' | 'user';
		pad: boolean;
	};

	return {
		userId: data.sub,
		planId: data.pid,
		name: data.nam,
		role: data.role,
		isProductAdmin: data.pad,
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

export async function setTemporaryAccessSession(
	res: Response,
	session: TemporaryAccessSession,
) {
	// create a session object with a max age we can validate later
	const sessionObject = {
		sub: session.temporaryAccessId,
		iat: Date.now(),
		pid: session.planId,
		nam: session.name,
		role: 'temporary',
	};
	const token = jwt.sign(sessionObject, SESSION_SECRET!, {
		expiresIn: '24h',
	});

	setTemporaryAccessCookie(res, token);
}

export async function getTemporaryAccessSession(
	req: IncomingMessage,
): Promise<TemporaryAccessSession | null> {
	const token = getTemporaryAccessCookie(req);

	if (!token) return null;

	const data = jwt.verify(token, SESSION_SECRET!) as {
		sub: string;
		iat: number;
		pid: string;
		nam: string | null;
		role: 'temporary';
	};

	return {
		temporaryAccessId: data.sub,
		planId: data.pid,
		name: data.nam,
	};
}
