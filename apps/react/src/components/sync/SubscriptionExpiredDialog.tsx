import { useAuth } from '@/hooks/useAuth.jsx';
import { SubscriptionError } from '@aglio/tools';
import { LogoutButton } from '../auth/LogoutButton.js';
import { Dialog, DialogContent } from '@a-type/ui/components/dialog';
import { H2 } from '@a-type/ui/components/typography';
import { ManageSubscriptionButton } from '@/components/sync/ManageSubscriptionButton.jsx';

export interface SubscriptionExpiredDialogProps {}

export function SubscriptionExpiredDialog({}: SubscriptionExpiredDialogProps) {
	const { data } = useAuth();
	const { session, subscriptionStatus } = data || {};

	const open =
		!!session && subscriptionStatus === SubscriptionError.SubscriptionExpired;

	return (
		<Dialog open={open}>
			<DialogContent>
				<H2>Subscription expired</H2>
				<p>
					Looks like you either cancelled your subscription, or your payment
					didn't go through. To keep using sync, please check your card details.
				</p>
				<ManageSubscriptionButton />
				<p>
					If you intended to cancel your subscription, log out to dismiss this
					message.
				</p>
				<LogoutButton>Log out</LogoutButton>
			</DialogContent>
		</Dialog>
	);
}
