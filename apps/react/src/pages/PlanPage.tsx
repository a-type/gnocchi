import {
	Box,
	Button,
	ButtonProps,
	Span,
} from '@/components/primitives/primitives.js';
import { InviteLinkButton } from '@/components/sync/InviteLinkButton.js';
import { LogoutButton } from '@/components/sync/LogoutButton.js';
import { API_HOST_HTTP } from '@/config.js';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import React from 'react';

export function PlanPage() {
	return (
		<Box
			w="full"
			direction="column"
			css={{
				mt: '$6',
			}}
			gap={4}
			align="start"
		>
			<a href="/">
				<ArrowLeftIcon /> Home
			</a>
			<ManageSubscriptionButton />
			<InviteLinkButton />
			<LogoutButton>Log out</LogoutButton>
		</Box>
	);
}

function ManageSubscriptionButton(props: ButtonProps) {
	return (
		<form action={`${API_HOST_HTTP}/api/stripe/create-portal`} method="POST">
			<Button type="submit" {...props}>
				Manage your plan
			</Button>
			<Span size="xs">Update your card or unsubscribe</Span>
		</form>
	);
}
