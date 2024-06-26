import { useFeatureFlag } from '@/hooks/useFeatureFlag.js';
import { useIsServiceWorkerRegistered } from '@/hooks/useIsServiceWorkerRegistered.js';
import {
	getIsSubscribedToPush,
	subscribeToPush,
	unsubscribeFromPush,
} from '@/push.js';
import { Switch } from '@a-type/ui/components/switch';
import { useEffect, useState } from 'react';

export interface PushSubscriptionToggleProps {}

export function PushSubscriptionToggle({}: PushSubscriptionToggleProps) {
	const enabled = useFeatureFlag('pushNotifications');
	const [loading, setLoading] = useState(true);
	const [subscribed, setSubscribed] = useState(false);

	useEffect(() => {
		getIsSubscribedToPush()
			.then((subbed) => {
				setSubscribed(subbed);
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
			});
	}, []);

	const subscribe = async () => {
		try {
			setLoading(true);
			await subscribeToPush();
			setSubscribed(true);
		} finally {
			setLoading(false);
		}
	};
	const unsubscribe = async () => {
		try {
			setLoading(true);
			await unsubscribeFromPush();
			setSubscribed(false);
		} finally {
			setLoading(false);
		}
	};
	const toggle = subscribed ? unsubscribe : subscribe;
	const canSubscribe = useIsServiceWorkerRegistered();
	if (!canSubscribe || !enabled) {
		return null;
	}

	return (
		<div className="flex flex-row gap-2 items-center">
			<Switch
				checked={subscribed}
				onCheckedChange={toggle}
				disabled={loading}
			/>
			<span>Notify me when someone adds or removes from the list</span>
		</div>
	);
}
