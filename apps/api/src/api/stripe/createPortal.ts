import { SubscriptionError } from '@aglio/tools';
import { Request, Response } from 'express';
import { getLoginSession } from '@aglio/auth';
import { UI_ORIGIN } from '../../config/deployedContext.js';
import { prisma } from '../../data/prisma.js';
import { stripe } from '../../data/stripe.js';

export async function createPortalHandler(req: Request, res: Response) {
	const session = await getLoginSession(req);
	if (!session) {
		return res.status(401).send('Please log in');
	}

	const plan = await prisma.plan.findUnique({
		where: { id: session.planId },
	});

	if (!plan) {
		return res.status(400).send('You do not have a plan');
	}

	if (!plan.stripeCustomerId) {
		return res.status(400).send(SubscriptionError.NoSubscription);
	}

	const portalSession = await stripe.billingPortal.sessions.create({
		customer: plan.stripeCustomerId,
		return_url: `${UI_ORIGIN}`,
	});

	return res.redirect(portalSession.url);
}
