import { PageContent, PageRoot } from '@/components/layouts/index.js';
import { Box } from '@/components/primitives/box/Box.jsx';
import {
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
		<PageRoot>
			<PageContent fullHeight noPadding>
				<Box width="full" direction="column" mt={6} p={4} gap={4} align="start">
					<a href="/">
						<ArrowLeftIcon /> Home
					</a>
					<div>
						<InviteLinkButton color="primary" />
						<Span size="xs">Get a link to invite others to your list</Span>
					</div>
					<ManageSubscriptionButton />
					<LogoutButton>Log out</LogoutButton>
				</Box>
			</PageContent>
		</PageRoot>
	);
}

function ManageSubscriptionButton(props: ButtonProps) {
	return (
		<form action={`${API_HOST_HTTP}/api/stripe/create-portal`} method="POST">
			<Button type="submit" {...props}>
				Manage your payment
			</Button>
			<Span size="xs">Update your card or unsubscribe</Span>
		</form>
	);
}
