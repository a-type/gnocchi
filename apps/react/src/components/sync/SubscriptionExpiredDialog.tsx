import React from 'react';
import { Dialog, DialogContent } from '@/components/primitives/Dialog.js';
import { useAuth } from '@/contexts/AuthContext.js';
import { SubscriptionError } from '@aglio/tools';
import { LogoutButton } from './LogoutButton.js';

export interface SubscriptionExpiredDialogProps {}

export function SubscriptionExpiredDialog({}: SubscriptionExpiredDialogProps) {
	const { session, subscriptionStatus } = useAuth();

	const open =
		!!session && subscriptionStatus === SubscriptionError.SubscriptionExpired;

	return (
		<Dialog open={open}>
			<DialogContent>
				<h2>Subscription expired</h2>
				<p>
					Looks like you either cancelled your subscription, or your payment
					didn't go through. To keep using sync, please check your card details.
				</p>
				{/* TODO: stripe checkout button here */}
				<p>
					If you intended to cancel your subscription, log out to dismiss this
					message.
				</p>
				<LogoutButton>Log out</LogoutButton>
			</DialogContent>
		</Dialog>
	);
}
