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
	const result = await webPush.sendNotification(
		{
			endpoint: subscription.endpoint,
			keys: {
				auth: subscription.auth,
				p256dh: subscription.p256dh,
			},
		},
		JSON.stringify(payload),
	);

	if (result.statusCode === 404 || result.statusCode === 401) {
		await prisma.pushSubscription.delete({
			where: {
				id: subscription.id,
			},
		});
		console.error('Push error', result.body);
		throw new Error('Subscription is no longer valid');
	}
}
