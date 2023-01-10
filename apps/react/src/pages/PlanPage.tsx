import { PageContent, PageRoot } from '@/components/layouts/index.js';
import { Box } from '@/components/primitives/box/Box.jsx';
import {
	Button,
	ButtonProps,
	H1,
	Span,
} from '@/components/primitives/index.js';
import { InviteLinkButton } from '@/components/sync/InviteLinkButton.js';
import { LogoutButton } from '@/components/auth/LogoutButton.js';
import { API_HOST_HTTP } from '@/config.js';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import { ManageCategoriesDialog } from '@/components/menu/ManageCategoriesDialog.jsx';
import { BugButton } from '@/components/menu/BugButton.jsx';

export function PlanPage() {
	return (
		<PageRoot>
			<PageContent fullHeight noPadding>
				<Box width="full" direction="column" mt={6} p={4} gap={4} align="start">
					<H1>Settings</H1>
					<div>
						<InviteLinkButton color="primary" />
						<Span size="xs">Get a link to invite others to your list</Span>
					</div>
					<ManageSubscriptionButton />
					<div>
						<ManageCategoriesDialog>
							<Button>Manage categories</Button>
						</ManageCategoriesDialog>
						<Span size="xs">Add, remove, and rearrange categories</Span>
					</div>
					<BugButton />
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
