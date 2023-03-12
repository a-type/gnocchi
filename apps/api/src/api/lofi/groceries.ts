import { Request, Response } from 'express';
import { ReplicaType, TokenProvider } from '@lo-fi/server';
import { assert, getGroceryLibraryName } from '@aglio/tools';
import { getLoginSession, getTemporaryAccessSession } from '@aglio/auth';
import { DEPLOYED_HOST } from '../../config/deployedContext.js';
import { verifySubscription } from 'src/auth/verifySubscription.js';

assert(!!process.env.LOFI_SECRET, 'LOFI_SECRET must be set');
const tokenProvider = new TokenProvider({
	secret: process.env.LOFI_SECRET,
});

export default async function groceriesHandler(req: Request, res: Response) {
	let planId;
	let userId;
	const session = await getLoginSession(req);
	if (!session) {
		const tempAccess = await getTemporaryAccessSession(req);
		if (!tempAccess) {
			return res.status(401).send('Please log in');
		} else {
			planId = tempAccess.planId;
			userId = tempAccess.temporaryAccessId;
		}
	} else {
		planId = session.planId;
		userId = session.userId;
		await verifySubscription(session);
	}

	const token = tokenProvider.getToken({
		userId,
		libraryId: getGroceryLibraryName(planId),
		syncEndpoint: `${DEPLOYED_HOST}/lofi`,
		type: ReplicaType.Realtime,
	});

	res.status(200).json({
		accessToken: token,
	});
}
