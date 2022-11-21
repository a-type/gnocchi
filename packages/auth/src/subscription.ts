import { Session } from './session.js';
import { prisma } from '@aglio/prisma';

export async function isSubscribed(session: Session | null) {
	if (!session?.planId) return false;
	const plan = await prisma.plan.findUnique({
		where: { id: session.planId },
	});
	return (
		plan?.subscriptionStatus === 'active' ||
		plan?.subscriptionStatus === 'trialing'
	);
}
