import { prisma } from 'src/data/prisma.js';
import { Session } from './session.js';
import { SubscriptionError as Message } from '@aglio/tools';

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

	if (!plan) {
		return Message.NoPlan;
	}
	if (!plan.stripeSubscriptionId) {
		return Message.NoSubscription;
	}
	if (plan.subscriptionStatus !== 'active') {
		return Message.NoSubscription;
	}
}
