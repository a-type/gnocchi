import { SubscriptionError } from '@aglio/tools';
import { Request, Response } from 'express';
import { getSubscriptionStatusError } from '../../auth/verifySubscription.js';
import {
	getLoginSession,
	removeTokenCookie,
	setLoginSession,
} from '@aglio/auth';

export default async function sessionHandler(req: Request, res: Response) {
	const session = await getLoginSession(req);
	if (!session) {
		return res.status(401).send({
			error: 'Please log in',
		});
	}

	const planStatusError = await getSubscriptionStatusError(session);

	if (
		planStatusError === SubscriptionError.NoAccount ||
		planStatusError === SubscriptionError.PlanChanged
	) {
		// our session is invalid, so we need to log the user out
		removeTokenCookie(res);
		return res.status(401).send({
			error: planStatusError,
		});
	}

	// refresh session
	await setLoginSession(res, session);

	res.status(200).json({ session, planStatus: planStatusError });
}
