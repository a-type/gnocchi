import { Request, Response } from 'express';
import { getLoginSession } from '@aglio/auth';
import { getSubscriptionStatusError } from '../../auth/verifySubscription.js';

export default async function planStatusHandler(req: Request, res: Response) {
	const session = await getLoginSession(req);
	if (!session) {
		return res.status(401).send('Please log in');
	}
	const statusError = await getSubscriptionStatusError(session);

	return res.status(200).json({
		planId: session.planId,
		statusError,
	});
}
