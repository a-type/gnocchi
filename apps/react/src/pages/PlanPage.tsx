import { LogoutButton } from '@/components/auth/LogoutButton.js';
import { BugButton } from '@/components/menu/BugButton.jsx';
import { ManageCategoriesDialog } from '@/components/menu/ManageCategoriesDialog.jsx';
import { InstallHint } from '@/components/promotional/InstallHint.jsx';
import { PromoteSubscriptionButton } from '@/components/promotional/PromoteSubscriptionButton.jsx';
import { TemporaryAccessLinkButton } from '@/components/settings/TemporaryAccessLinkButton.jsx';
import { InviteLinkButton } from '@/components/sync/InviteLinkButton.js';
import { LoginButton } from '@/components/sync/LoginButton.jsx';
import { ResetToServer } from '@/components/sync/ResetToServer.jsx';
import { MemberManager } from '@/components/sync/manage/MemberManager.jsx';
import { PushSubscriptionToggle } from '@/components/sync/push/PushSubscriptionToggle.jsx';
import { API_HOST_HTTP, PRICE_MONTHLY_DOLLARS } from '@/config.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useInterval } from '@/hooks/useInterval.js';
import {
	Box,
	Button,
	ButtonProps,
	Divider,
	H1,
	H2,
	PageContent,
	PageRoot,
	Span,
	TextLink,
} from '@aglio/ui';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { ReactNode } from 'react';

const contents = {
	offline: OfflineContents,
	anonymous: AnonymousContents,
	unsubscribed: UnsubscribedContents,
	online: OnlineContents,
} as const;

export function PlanPage() {
	const { data, error } = useAuth();
	const { session, isSubscribed } = data || {};

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
				<Box
					width="full"
					direction="column"
					mt={6}
					p={4}
					gap={4}
					align="flex-start"
				>
					<H1>Settings</H1>
					<Contents />
					<Box fontSize="xs" gap={2}>
						<TextLink
							href="/privacy-policy"
							target="_blank"
							rel="noopener noreferrer"
						>
							Privacy policy
						</TextLink>
						<TextLink href="/tos" target="_blank" rel="noopener noreferrer">
							Terms and conditions of use
						</TextLink>
					</Box>
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
	<Box width="full" direction="column" gap={4} align="flex-start">
		{children}
	</Box>
);

function OfflineContents() {
	const { refetch } = useAuth();

	useInterval(refetch, 3000);

	return (
		<MainContainer>
			<InstallHint />
			<Button size="small" color="default" onClick={() => refetch()}>
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
			<Box direction="row" align="center" gap={2}>
				<PromoteSubscriptionButton color="primary">
					Upgrade for ${PRICE_MONTHLY_DOLLARS}/mo
				</PromoteSubscriptionButton>
				<LoginButton color="default" returnTo="/">
					<ArrowRightIcon />
					<span>Sign in</span>
				</LoginButton>
			</Box>
			<Divider />
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
			<MemberManager />
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
			<H2>Collaborate</H2>
			<Invite />
			<TemporaryAccessLinkButton />
			<PushSubscriptionToggle />
			<Divider />
			<H2>Manage</H2>
			<ManageCategories />
			<MemberManager />
			<Divider />
			<H2>Troubleshoot</H2>
			<BugButton />
			<ResetToServer />
			<Divider />
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
		</div>
	);
}
