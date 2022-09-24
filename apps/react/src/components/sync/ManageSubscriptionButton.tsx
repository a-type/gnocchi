import {
	Button,
	ButtonProps,
	Span,
} from '@/components/primitives/primitives.js';
import { API_HOST_HTTP } from '@/config.js';
import React from 'react';

export interface ManageSubscriptionButtonProps extends ButtonProps {}

export function ManageSubscriptionButton(props: ManageSubscriptionButtonProps) {
	return (
		<form action={`${API_HOST_HTTP}/api/stripe/create-portal`} method="POST">
			<Button type="submit" {...props}>
				Manage your subscription
			</Button>
			<Span size="xs">Update your card or unsubscribe</Span>
		</form>
	);
}
