import { SubscriptionError } from '@aglio/tools';
import { Dialog, DialogContent } from 'components/primitives/Dialog.js';
import { useAuth } from 'contexts/AuthContext.js';
import React from 'react';
import { LogoutButton } from './LogoutButton.js';
import { SubscribeButton } from './SubscribeButton.js';

export interface CompleteSignupDialogProps {}

export function CompleteSignupDialog({}: CompleteSignupDialogProps) {
	const { session, subscriptionStatus } = useAuth();

	const open =
		!!session && subscriptionStatus === SubscriptionError.NoSubscription;

	return (
		<Dialog open={open}>
			<DialogContent>
				<h2>Complete Signup</h2>
				<p>
					Now that you're signed in, finish creating your subscription to start
					syncing and sharing your list!
				</p>
				<SubscribeButton />
				<p>Or, if you changed your mind...</p>
				<LogoutButton>Log out</LogoutButton>
			</DialogContent>
		</Dialog>
	);
}
