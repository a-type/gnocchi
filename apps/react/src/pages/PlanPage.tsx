import { LogoutButton } from '@/components/auth/LogoutButton.js';
import { ChangelogDisplay } from '@/components/changelog/ChangelogDisplay.jsx';
import { Icon } from '@/components/icons/Icon.jsx';
import { BugButton } from '@/components/menu/BugButton.jsx';
import { ManageCategoriesDialog } from '@/components/menu/ManageCategoriesDialog.jsx';
import { TextLink } from '@/components/nav/Link.jsx';
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
import { UpdatePrompt } from '@/components/updatePrompt/UpdatePrompt.jsx';
import { checkForUpdate } from '@/components/updatePrompt/updateState.js';
import { API_HOST_HTTP, PRICE_MONTHLY_DOLLARS } from '@/config.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useInterval } from '@/hooks/useInterval.js';
import { Button, ButtonProps } from '@a-type/ui/components/button';
import { Divider } from '@a-type/ui/components/divider';
import { PageContent } from '@a-type/ui/components/layouts';
import { H1, H2 } from '@a-type/ui/components/typography';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { ReactNode, useEffect } from 'react';

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

	useEffect(() => {
		checkForUpdate();
	}, []);

	return (
		<PageContent fullHeight noPadding>
			<div className="flex flex-col w-full mt-6 p-4 gap-4 items-start">
				<H1>Settings</H1>
				<UpdatePrompt />
				<Contents />
				<div className="text-xs flex flex-col gap-2">
					<ChangelogDisplay>
						<Button>
							<Icon name="gift" />
							<span>What's new</span>
						</Button>
					</ChangelogDisplay>
					<TextLink to="/privacy-policy">Privacy policy</TextLink>
					<TextLink to="/tos">Terms and conditions of use</TextLink>
				</div>
			</div>
		</PageContent>
	);
}

export default PlanPage;

function ManageSubscriptionButton(props: ButtonProps) {
	return (
		<form action={`${API_HOST_HTTP}/api/stripe/create-portal`} method="POST">
			<Button type="submit" {...props}>
				Manage your payment
			</Button>
			<span className="text-xs">Update your card or unsubscribe</span>
		</form>
	);
}

const MainContainer = ({ children }: { children: ReactNode }) => (
	<div className="flex flex-col items-start w-full gap-4">{children}</div>
);

function ManageSection() {
	return (
		<>
			<ManageCategories />
			{/* <ManageFoodsButton /> */}
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
			<div>
				<div className="flex flex-row items-center gap-2">
					<PromoteSubscriptionButton color="primary">
						Upgrade for ${PRICE_MONTHLY_DOLLARS}/mo
					</PromoteSubscriptionButton>
					<LoginButton color="default" returnTo="/">
						<ArrowRightIcon />
						<span>Sign in</span>
					</LoginButton>
				</div>
				<span className="text-xs">
					Sync devices, collaborate with others, and more
				</span>
			</div>
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
			<div className="bg-primary-wash color-black p-4 rounded-lg">
				Subscription inactive
			</div>
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
			<span className="text-xs">All members are free</span>
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
			<span className="text-xs">Add, remove, and rearrange categories</span>
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
