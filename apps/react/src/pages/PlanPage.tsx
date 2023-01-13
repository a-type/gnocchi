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
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import { ManageCategoriesDialog } from '@/components/menu/ManageCategoriesDialog.jsx';
import { BugButton } from '@/components/menu/BugButton.jsx';
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useInterval } from '@/hooks/useInterval.js';
import { LoginButton } from '@/components/sync/LoginButton.jsx';
import { InstallHint } from '@/components/promotional/InstallHint.jsx';

const contents = {
	offline: OfflineContents,
	anonymous: AnonymousContents,
	unsubscribed: UnsubscribedContents,
	online: OnlineContents,
} as const;

export function PlanPage() {
	const { session, isSubscribed, error } = useAuth();

	let state: keyof typeof contents = 'online';
	if (error) {
		state = 'offline';
	} else if (!session) {
		state = 'anonymous';
	} else if (!isSubscribed) {
		state = 'unsubscribed';
	}

	const Contents = contents[state];

	return (
		<PageRoot>
			<PageContent fullHeight noPadding>
				<Box width="full" direction="column" mt={6} p={4} gap={4} align="start">
					<H1>Settings</H1>
					<Contents />
				</Box>
			</PageContent>
		</PageRoot>
	);
}

export default PlanPage;

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

const MainContainer = ({ children }: { children: ReactNode }) => (
	<Box width="full" direction="column" gap={4} align="start">
		{children}
	</Box>
);

function OfflineContents() {
	const { refetch } = useAuth();

	useInterval(refetch, 3000);

	return (
		<MainContainer>
			<InstallHint />
			<Button size="small" color="default" onClick={refetch}>
				Retry connection
			</Button>
			<ManageCategories />
			<BugButton />
		</MainContainer>
	);
}

function AnonymousContents() {
	return (
		<MainContainer>
			<InstallHint />
			<LoginButton color="primary" returnTo="/">
				<ArrowRightIcon />
				&nbsp;Subscribe (or sign in)
			</LoginButton>
			<ManageCategories />
			<BugButton />
		</MainContainer>
	);
}

function UnsubscribedContents() {
	return (
		<MainContainer>
			<InstallHint />
			<Box
				background="primaryWash"
				color="primaryDarker"
				p={4}
				borderRadius="lg"
			>
				Subscription inactive
			</Box>
			<ManageSubscriptionButton />
			<ManageCategories />
			<LogoutButton>Sign out</LogoutButton>
			<BugButton />
		</MainContainer>
	);
}

function OnlineContents() {
	return (
		<MainContainer>
			<InstallHint />
			<Invite />
			<ManageCategories />
			<ManageSubscriptionButton />
			<BugButton />
			<LogoutButton>Sign out</LogoutButton>
		</MainContainer>
	);
}

function ManageCategories() {
	return (
		<div>
			<ManageCategoriesDialog>
				<Button>Manage categories</Button>
			</ManageCategoriesDialog>
			<Span size="xs">Add, remove, and rearrange categories</Span>
		</div>
	);
}

function Invite() {
	return (
		<div>
			<InviteLinkButton color="primary" />
			<Span size="xs">Get a link to invite others to your list</Span>
		</div>
	);
}
