import { PushSubscription, prisma } from '@aglio/prisma';
import webPush from 'web-push';

const vapidKeys = {
	publicKey: process.env.VAPID_PUBLIC_KEY!,
	privateKey: process.env.VAPID_PRIVATE_KEY!,
};

if (vapidKeys.publicKey && vapidKeys.privateKey) {
	webPush.setVapidDetails(
		'mailto:hi@gnocchi.club',
		vapidKeys.publicKey,
		vapidKeys.privateKey,
	);
}

export async function sendPush(subscription: PushSubscription, payload: any) {
	if (!subscription.auth || !subscription.p256dh) {
		throw new Error('Invalid subscription, no keys');
	}
	try {
		await webPush.sendNotification(
			{
				endpoint: subscription.endpoint,
				keys: {
					auth: subscription.auth,
					p256dh: subscription.p256dh,
				},
			},
			JSON.stringify(payload),
		);
	} catch (err) {
		if (isPushError(err)) {
			if (err.statusCode >= 400 && err.statusCode < 500) {
				await prisma.pushSubscription.delete({
					where: {
						id: subscription.id,
					},
				});
				console.error('Push error', err.body);
				throw new Error('Subscription is no longer valid');
			}
		} else {
			console.error('Unknown error during push', err);
			throw new Error('Unknown error during push');
		}
	}
}

function isPushError(err: any): err is { statusCode: number; body: string } {
	return err.statusCode && err.body;
}
