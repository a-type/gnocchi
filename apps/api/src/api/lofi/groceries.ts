import { Request, Response } from 'express';
import { ReplicaType, TokenProvider } from '@verdant-web/server';
import { assert, getGroceryLibraryName } from '@aglio/tools';
import { getLoginSession, getTemporaryAccessSession } from '@aglio/auth';
import { DEPLOYED_HOST } from '../../config/deployedContext.js';
import { verifySubscription } from 'src/auth/verifySubscription.js';

assert(!!process.env.LOFI_SECRET, 'LOFI_SECRET must be set');
const tokenProvider = new TokenProvider({
	secret: process.env.LOFI_SECRET,
});

export default async function groceriesHandler(req: Request, res: Response) {
	let token;

	const session = await getLoginSession(req);
	if (!session) {
		const tempAccess = await getTemporaryAccessSession(req);
		if (!tempAccess) {
			return res.status(401).send('Please log in');
		} else {
			token = tokenProvider.getToken({
				userId: tempAccess.temporaryAccessId,
				libraryId: getGroceryLibraryName(tempAccess.planId),
				syncEndpoint: `${DEPLOYED_HOST}/lofi`,
				type: ReplicaType.PassiveRealtime,
			});
		}
	} else {
		await verifySubscription(session);
		token = tokenProvider.getToken({
			userId: session.userId,
			libraryId: getGroceryLibraryName(session.planId),
			syncEndpoint: `${DEPLOYED_HOST}/lofi`,
			type: ReplicaType.Realtime,
		});
	}

	res.status(200).json({
		accessToken: token,
	});
}
