import type { Request } from 'express';
import type { IncomingHttpHeaders } from 'http';

export function getIsHubAuthorizedRequest(headers: IncomingHttpHeaders) {
	const authorization = headers.authorization;
	if (!authorization) {
		return false;
	}
	const [scheme, token] = authorization.split(' ');
	if (scheme !== 'Bearer') {
		return false;
	}
	if (token !== process.env.HUB_AUTH_TOKEN) {
		return false;
	}
	return true;
}

export function addHubAuthorizationToRequest(req: Request) {
	req.headers.authorization = `Bearer ${process.env.HUB_AUTH_TOKEN}`;
}
