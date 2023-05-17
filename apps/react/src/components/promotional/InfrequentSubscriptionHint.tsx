import { APP_NAME } from '@/config.js';
import { useIsSubscribed } from '@/hooks/useAuth.jsx';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { PromoteSubscriptionButton } from './PromoteSubscriptionButton.jsx';
import { div } from '@aglio/ui/components/box';
import { P } from '@aglio/ui/components/typography';
import { Button } from '@aglio/ui/components/button';

export function InfrequentSubscriptionHint() {
	const isSubscribed = useIsSubscribed();

	const [startCountingAt] = useLocalStorage(
		'first-time-seen',
		Date.now(),
		true,
	);

	// if this component mounts and the user has been using the app for more than 30 days, show the hint
	// once. after dismissal, the time to show again is upped to 60 days.
	const [dismissedAt, setDismissedAt] = useLocalStorage(
		'subscription-hint-dismissed-at',
		0,
	);

	const now = Date.now();
	const daysSinceFirstSeen = (now - startCountingAt) / 1000 / 60 / 60 / 24;
	const daysSinceDismissed = (now - dismissedAt) / 1000 / 60 / 60 / 24;

	if (isSubscribed) {
		return null;
	}

	if (daysSinceDismissed > 60 && daysSinceFirstSeen > 30) {
		return (
			<div className="border-light rounded-md flex flex-col p-4 gap-3 color-gray8">
				<P>Enjoying {APP_NAME}? A subscription unlocks device sync and more</P>
				<div className="flex items-center justify-end gap-2">
					<Button color="ghost" onClick={() => setDismissedAt(Date.now())}>
						Dismiss
					</Button>
					<PromoteSubscriptionButton>Learn more</PromoteSubscriptionButton>
				</div>
			</div>
		);
	}

	return null;
}
