import { Button, ButtonProps, Span } from '@aglio/ui';
import { API_HOST_HTTP } from '@/config.js';
import React from 'react';

export interface ManageSubscriptionButtonProps extends ButtonProps {}

export function ManageSubscriptionButton({
	className,
	...props
}: ManageSubscriptionButtonProps) {
	return (
		<form
			className={className}
			action={`${API_HOST_HTTP}/api/stripe/create-portal`}
			method="POST"
		>
			<Button type="submit" {...props}>
				Change your subscription
			</Button>
			<Span size="xs">Update your card or unsubscribe</Span>
		</form>
	);
}
