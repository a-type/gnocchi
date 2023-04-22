import { LogoutButton } from '@/components/auth/LogoutButton.js';
import { ManageFoodsButton } from '@/components/foods/ManageFoodsButton.jsx';
import { BugButton } from '@/components/menu/BugButton.jsx';
import { ManageCategoriesDialog } from '@/components/menu/ManageCategoriesDialog.jsx';
import { InstallHint } from '@/components/promotional/InstallHint.jsx';
import { PromoteSubscriptionButton } from '@/components/promotional/PromoteSubscriptionButton.jsx';
import { ColorModeSelect } from '@/components/settings/ColorModeSelect.jsx';
import { TemporaryAccessLinkButton } from '@/components/settings/TemporaryAccessLinkButton.jsx';
import { InviteLinkButton } from '@/components/sync/InviteLinkButton.js';
import { LoginButton } from '@/components/sync/LoginButton.jsx';
import { ReloadButton } from '@/components/sync/ReloadButton.jsx';
import { ResetToServer } from '@/components/sync/ResetToServer.jsx';
import { MemberManager } from '@/components/sync/manage/MemberManager.jsx';
import { PushSubscriptionToggle } from '@/components/sync/push/PushSubscriptionToggle.jsx';
import { API_HOST_HTTP, PRICE_MONTHLY_DOLLARS } from '@/config.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useInterval } from '@/hooks/useInterval.js';
import { Box } from '@aglio/ui/components/box';
import { Button, ButtonProps } from '@aglio/ui/components/button';
import { Divider } from '@aglio/ui/components/divider';
import { PageContent, PageRoot } from '@aglio/ui/components/layouts';
import { TextLink } from '@/components/nav/Link.jsx';
import { H1, H2, Span } from '@aglio/ui/components/typography';
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
						<TextLink to="/privacy-policy">Privacy policy</TextLink>
						<TextLink to="/tos">Terms and conditions of use</TextLink>
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

function ManageSection() {
	return (
		<>
			<ManageCategories />
			<ManageFoodsButton />
		</>
	);
}

function OfflineContents() {
	const { refetch } = useAuth();

	useInterval(refetch, 3000);

	return (
		<MainContainer>
			<InstallHint />
			<ColorModeSelect />
			<Button size="small" color="default" onClick={() => refetch()}>
				Retry connection
			</Button>
			<ManageSection />
			<Divider />
			<BugButton />
			<ReloadButton />
		</MainContainer>
	);
}

function AnonymousContents() {
	return (
		<MainContainer>
			<InstallHint />
			<ColorModeSelect />
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
			<ManageSection />
			<Divider />
			<BugButton />
			<ReloadButton />
		</MainContainer>
	);
}

function UnsubscribedContents() {
	return (
		<MainContainer>
			<InstallHint />
			<ColorModeSelect />
			<Box background="primaryWash" color="primaryInk" p={4} borderRadius="lg">
				Subscription inactive
			</Box>
			<ManageSubscriptionButton />
			<MemberManager />
			<ManageSection />
			<LogoutButton>Sign out</LogoutButton>
			<Divider />
			<BugButton />
			<ReloadButton />
		</MainContainer>
	);
}

function OnlineContents() {
	return (
		<MainContainer>
			<InstallHint />
			<ColorModeSelect />
			<H2>Collaborate</H2>
			<Invite />
			<TemporaryAccessLinkButton />
			<PushSubscriptionToggle />
			<Divider />
			<H2>Manage</H2>
			<ManageSection />
			<MemberManager />
			<Divider />
			<H2>Troubleshoot</H2>
			<BugButton />
			<ReloadButton />
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
