import { useAuth } from '@/contexts/AuthContext.js';
import { hooks } from '@/stores/groceries/index.js';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import {
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverTrigger,
} from '../primitives/Popover.js';
import { Button, Span } from '../primitives/index.js';
import { styled } from '@/stitches.config.js';
import { ManageCategoriesDialog } from './ManageCategoriesDialog.js';
import { LoginButton } from '../sync/LoginButton.js';
import { ManagePlanButton } from '../sync/ManagePlanButton.js';
import { LogoutButton } from '../sync/LogoutButton.js';
import { BugButton } from './BugButton.js';
import { useSnapshot } from 'valtio';
import { menuState } from './state.js';
import { Box } from '../primitives/box/Box.jsx';

export function MainMenu() {
	const { session, isSubscribed, error } = useAuth();
	const isSyncing = hooks.useSyncStatus();

	const snap = useSnapshot(menuState);

	let state: keyof typeof contents = 'online';
	if (error) {
		state = 'offline';
	} else if (!session) {
		state = 'anonymous';
	} else if (!isSubscribed) {
		state = 'unsubscribed';
	} else if (!isSyncing) {
		state = 'offline';
	}

	const Contents = contents[state];

	return (
		<Popover
			open={snap.open}
			onOpenChange={(isOpen) => (menuState.open = isOpen)}
		>
			<PopoverTrigger asChild>
				<Button size="small" color="ghost">
					<HamburgerMenuIcon />
				</Button>
			</PopoverTrigger>
			{/* @ts-ignore */}
			<PopoverContent collisionPadding={16} align="start" css={{ p: 0 }}>
				<PopoverArrow />
				<Contents />
			</PopoverContent>
		</Popover>
	);
}

const MenuList = styled('div' as const, {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'start',
	width: 300,
	maxWidth: '90vw',
});

const contents = {
	offline: OfflineContents,
	anonymous: AnonymousContents,
	unsubscribed: UnsubscribedContents,
	online: OnlineContents,
} as const;

const MenuBanner = styled('div' as const, {
	width: '100%',
	textAlign: 'center',
	backgroundColor: '$lemonLighter',
	p: '$2',
});

const MenuSection = styled('div' as const, {
	display: 'flex',
	flexDirection: 'column',
	gap: '$4',
	alignItems: 'start',
	p: '$5',
	width: '100%',

	'& + &': {
		borderTop: '1px solid $black',
	},
});

function OfflineContents() {
	const { refetch } = useAuth();
	return (
		<MenuList>
			<MenuSection>
				<MenuBanner>
					<Span size="small">Offline</Span>
				</MenuBanner>
				<Button size="small" color="default" onClick={refetch}>
					Retry connection
				</Button>
				<ManageCategoriesDialog>
					<Button size="small" color="default">
						Manage categories
					</Button>
				</ManageCategoriesDialog>
			</MenuSection>
			<MenuSection>
				<BugButton />
			</MenuSection>
		</MenuList>
	);
}

function AnonymousContents() {
	return (
		<MenuList>
			<MenuSection>
				<LoginButton
					color="primary"
					size="small"
					provider="google"
					returnTo="/"
				>
					Start syncing
				</LoginButton>
				<Span size="xs">
					14 days free. Unlimited devices and collaborators. Cancel anytime and
					keep your list.
				</Span>
				<ManageCategoriesDialog>
					<Button size="small" color="default">
						Manage categories
					</Button>
				</ManageCategoriesDialog>
			</MenuSection>
			<MenuSection>
				<BugButton />
			</MenuSection>
		</MenuList>
	);
}

function OnlineContents() {
	return (
		<MenuList>
			<MenuSection>
				<Box flexDirection="row" gap={2}>
					<ManagePlanButton color="default" size="small" />
					<LogoutButton color="default" size="small">
						Log out
					</LogoutButton>
				</Box>
			</MenuSection>
			<MenuSection>
				<ManageCategoriesDialog>
					<Button color="default" size="small">
						Manage categories
					</Button>
				</ManageCategoriesDialog>
			</MenuSection>
			<MenuSection>
				<BugButton />
			</MenuSection>
		</MenuList>
	);
}

function UnsubscribedContents() {
	// user has account but has not completed signup
	return (
		<MenuList>
			<MenuSection>
				<MenuBanner>
					<Span size="small">Subscription inactive</Span>
				</MenuBanner>
				<Box flexDirection="row" gap={2}>
					<ManagePlanButton color="default" size="small" />
					<LogoutButton>Log out</LogoutButton>
				</Box>
			</MenuSection>
			<MenuSection>
				<ManageCategoriesDialog>
					<Button color="default" size="small">
						Manage categories
					</Button>
				</ManageCategoriesDialog>
			</MenuSection>
			<MenuSection>
				<BugButton />
			</MenuSection>
		</MenuList>
	);
}
