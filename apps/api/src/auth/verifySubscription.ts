import { prisma } from 'src/data/prisma.js';
import { Session } from '@aglio/auth';
import { SubscriptionError as Message } from '@aglio/tools';
import Stripe from 'stripe';

export class SubscriptionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'SubscriptionError';
	}
}

export async function verifySubscription(session: Session) {
	const status = await getSubscriptionStatusError(session);
	if (status) {
		throw new SubscriptionError(status);
	}
}

/**
 * WARNING: mutates session, because I'm lazy.
 */
export async function getSubscriptionStatusError(session: Session) {
	const profileAndPlan = await prisma.profile.findUnique({
		where: { id: session.userId },
		include: {
			plan: true,
		},
	});

	if (!profileAndPlan) {
		return Message.NoAccount;
	}

	const plan = profileAndPlan.plan;

	if (plan.id !== session.planId) {
		// the user's plan has changed, so we need to refresh the session
		return Message.PlanChanged;
	}

	if (!plan) {
		return Message.NoPlan;
	}
	if (!plan.stripeSubscriptionId) {
		return Message.NoSubscription;
	}
	if (
		!plan.subscriptionStatus ||
		rejectedSubscriptionStatuses.includes(
			plan.subscriptionStatus as Stripe.Subscription.Status,
		)
	) {
		return Message.NoSubscription;
	}

	// no error? update session
	session.role = profileAndPlan.role as 'admin' | 'user';
	session.planId = plan.id;
	session.name = profileAndPlan.friendlyName;
	session.isProductAdmin = profileAndPlan.isProductAdmin;
}

const rejectedSubscriptionStatuses: Stripe.Subscription.Status[] = [
	'canceled',
	'past_due',
	'unpaid',
	'incomplete_expired',
];
