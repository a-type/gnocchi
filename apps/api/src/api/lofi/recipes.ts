import { Request, Response } from 'express';
import { ReplicaType, TokenProvider } from '@lo-fi/server';
import { assert } from '@aglio/tools';
import { getLoginSession } from '@aglio/auth';
import { DEPLOYED_HOST } from '../../config/deployedContext.js';
import { verifySubscription } from 'src/auth/verifySubscription.js';

assert(!!process.env.LOFI_SECRET, 'LOFI_SECRET must be set');
const tokenProvider = new TokenProvider({
	secret: process.env.LOFI_SECRET,
});

export default async function recipesHandler(req: Request, res: Response) {
	const session = await getLoginSession(req);
	if (!session) {
		return res.status(401).send('Please log in');
	}

	await verifySubscription(session);

	const token = tokenProvider.getToken({
		userId: session.userId,
		libraryId: session.planId + '_recipes',
		syncEndpoint: `${DEPLOYED_HOST}/lofi`,
		type: ReplicaType.Realtime,
	});

	res.status(200).json({
		accessToken: token,
	});
}
