import { SubscriptionError } from '@aglio/tools';
import { Request, Response } from 'express';
import { getSubscriptionStatusError } from 'src/auth/verifySubscription.js';
import { getLoginSession, removeTokenCookie } from '@aglio/auth';

export default async function sessionHandler(req: Request, res: Response) {
	const session = await getLoginSession(req);
	if (!session) {
		return res.status(401).send('Please log in');
	}

	const planStatusError = await getSubscriptionStatusError(session);

	if (planStatusError === SubscriptionError.NoAccount) {
		// our session is invalid, so we need to log the user out
		removeTokenCookie(res);
		return res.status(401).send('Please log in');
	}

	res.status(200).json({ session, planStatus: planStatusError });
}
