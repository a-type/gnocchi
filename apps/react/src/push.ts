import { trpcClient } from '@/trpc.js';

export async function subscribeToPush() {
	if (!('serviceWorker' in navigator)) {
		// Service Worker isn't supported on this browser, disable or hide UI.
		return;
	}

	if (!('PushManager' in window)) {
		// Push isn't supported on this browser, disable or hide UI.
		return;
	}

	const sw = await navigator.serviceWorker.getRegistration();

	if (!sw) {
		console.warn(
			'Service worker registration not found; cannot register push notifications',
		);
		return;
	}

	const subscription = await sw.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: urlBase64ToUint8Array(
			import.meta.env.VITE_VAPID_PUBLIC_KEY!,
		),
	});

	const parsedSubscription = JSON.parse(JSON.stringify(subscription)) as {
		endpoint: string;
		expirationTime: number | null;
		keys: {
			p256dh: string;
			auth: string;
		};
	};
	await trpcClient.plan.subscribeToPushNotifications.mutate(parsedSubscription);
}

export async function unsubscribeFromPush() {
	const sw = await navigator.serviceWorker.getRegistration();

	if (!sw) {
		console.warn(
			'Service worker registration not found; cannot register push notifications',
		);
		return;
	}

	const subscription = await sw.pushManager.getSubscription();

	if (!subscription) {
		console.warn('No push subscription found');
		return;
	}

	await subscription.unsubscribe();
	await trpcClient.plan.unsubscribeFromPushNotifications.mutate({
		endpoint: subscription.endpoint,
	});
}

export async function getIsSubscribedToPush() {
	const sw = await navigator.serviceWorker.getRegistration();

	if (!sw) {
		console.warn(
			'Service worker registration not found; cannot register push notifications',
		);
		return false;
	}

	const subscription = await sw.pushManager.getSubscription();

	if (!subscription) {
		return false;
	}

	return true;
}

const urlBase64ToUint8Array = (base64String: string) => {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, '+')
		.replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
};
