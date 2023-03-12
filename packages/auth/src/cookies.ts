import { parse, serialize } from 'cookie';
import { Request, Response } from 'express';
import { IncomingMessage, OutgoingMessage } from 'http';

const SESSION_COOKIE_NAME = 'ag-session';

export const MAX_AGE = 60 * 60 * 24 * 14; // 2 weeks

export function setSessionCookie(res: OutgoingMessage, token: string) {
	const cookie = serialize(SESSION_COOKIE_NAME, token, {
		maxAge: MAX_AGE,
		expires: new Date(Date.now() + MAX_AGE * 1000),
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/',
	});

	res.setHeader('Set-Cookie', cookie);
}

export function removeSessionCookie(res: OutgoingMessage) {
	const cookie = serialize(SESSION_COOKIE_NAME, '', {
		maxAge: -1,
		path: '/',
	});

	res.setHeader('Set-Cookie', cookie);
}

export function parseCookies(req: IncomingMessage) {
	if ((req as any).cookies) return (req as any).cookies;

	const cookie = req.headers?.cookie;
	return parse(cookie || '');
}

export function getTokenCookie(req: IncomingMessage) {
	return parseCookies(req)[SESSION_COOKIE_NAME];
}

export function setReturnToCookie(req: Request, res: Response) {
	let returnTo = req.query.returnTo as string | undefined;
	if (!returnTo) {
		returnTo = req.headers.referer as string | undefined;
	}
	if (!returnTo) {
		return;
	}

	const cookie = serialize('ag-return-to', returnTo, {
		maxAge: MAX_AGE,
		expires: new Date(Date.now() + MAX_AGE * 1000),
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/',
	});

	res.setHeader('Set-Cookie', cookie);
}

export function getReturnToCookie(req: IncomingMessage) {
	return parseCookies(req)['ag-return-to'];
}

export function removeReturnToCookie(res: OutgoingMessage) {
	const cookie = serialize('ag-return-to', '', {
		maxAge: -1,
		path: '/',
	});

	res.setHeader('Set-Cookie', cookie);
}

export function setInviteIdCookie(req: Request, res: Response) {
	let inviteId = req.query.inviteId as string | undefined;
	if (!inviteId) {
		return;
	}

	const cookie = serialize('ag-invite-id', inviteId, {
		maxAge: MAX_AGE,
		expires: new Date(Date.now() + MAX_AGE * 1000),
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/',
	});

	res.setHeader('Set-Cookie', cookie);
}

export function getInviteIdCookie(req: IncomingMessage) {
	return parseCookies(req)['ag-invite-id'];
}

export function removeInviteIdCookie(res: OutgoingMessage) {
	const cookie = serialize('ag-invite-id', '', {
		maxAge: -1,
		path: '/',
	});

	res.setHeader('Set-Cookie', cookie);
}

export function setTemporaryAccessCookie(res: OutgoingMessage, token: string) {
	const cookie = serialize('ag-temp-access', token, {
		maxAge: MAX_AGE,
		expires: new Date(Date.now() + MAX_AGE * 1000),
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/',
	});

	res.setHeader('Set-Cookie', cookie);
}

export function getTemporaryAccessCookie(req: IncomingMessage) {
	return parseCookies(req)['ag-temp-access'];
}

export function removeTemporaryAccessCookie(res: OutgoingMessage) {
	const cookie = serialize('ag-temp-access', '', {
		maxAge: -1,
		path: '/',
	});

	res.setHeader('Set-Cookie', cookie);
}
