import React from 'react';
import { useAuth } from '@/contexts/AuthContext.js';
import { hooks } from '@/stores/groceries/index.js';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import {
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverTrigger,
} from '../primitives/Popover.js';
import { Box, Button, Span } from '../primitives/primitives.js';
import { styled } from '@/stitches.config.js';
import { ManageCategoriesDialog } from './ManageCategoriesDialog.js';
import { LoginButton } from '../sync/LoginButton.js';
import { ManagePlanButton } from '../sync/ManagePlanButton.js';
import { InviteLinkButton } from '../sync/InviteLinkButton.js';
import { LogoutButton } from '../sync/LogoutButton.js';
import { BugButton } from './BugButton.js';

export function MainMenu() {
	const { session, isSubscribed, error } = useAuth();
	const isSyncing = hooks.useSyncStatus();

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
		<Popover>
			<PopoverTrigger asChild>
				<Button size="small" color="ghost">
					<HamburgerMenuIcon />
				</Button>
			</PopoverTrigger>
			{/* @ts-ignore */}
			<PopoverContent collisionPadding={16} align="start">
				<PopoverArrow />
				<Contents />
			</PopoverContent>
		</Popover>
	);
}

const MenuList = styled('div' as const, {
	display: 'flex',
	flexDirection: 'column',
	gap: '$4',
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
});

const MenuDivider = styled('div' as const, {
	width: '100%',
	height: 1,
	backgroundColor: '$black',
});

function OfflineContents() {
	const { refetch } = useAuth();
	return (
		<MenuList>
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
			<MenuDivider />
			<BugButton />
		</MenuList>
	);
}

function AnonymousContents() {
	return (
		<MenuList>
			<LoginButton color="primary" size="small" provider="google" returnTo="/">
				Start syncing
			</LoginButton>
			<Span size="xs">
				14 days free. Unlimited devices and collaborators. Cancel anytime.
			</Span>
			<ManageCategoriesDialog>
				<Button size="small" color="default">
					Manage categories
				</Button>
			</ManageCategoriesDialog>
			<MenuDivider />
			<BugButton />
		</MenuList>
	);
}

function OnlineContents() {
	return (
		<MenuList>
			<Box direction="row" gap="2">
				<ManagePlanButton color="default" size="small" />
				<LogoutButton color="default" size="small">
					Log out
				</LogoutButton>
			</Box>
			<MenuDivider />
			<ManageCategoriesDialog>
				<Button color="default" size="small">
					Manage categories
				</Button>
			</ManageCategoriesDialog>
			<MenuDivider />
			<BugButton />
		</MenuList>
	);
}

function UnsubscribedContents() {
	// user has account but has not completed signup
	return (
		<MenuList>
			<MenuBanner>
				<Span size="small">Subscription inactive</Span>
			</MenuBanner>
			<Box direction="row" gap="2">
				<ManagePlanButton color="default" size="small" />
				<LogoutButton>Log out</LogoutButton>
			</Box>
			<MenuDivider />
			<ManageCategoriesDialog>
				<Button color="default" size="small">
					Manage categories
				</Button>
			</ManageCategoriesDialog>
			<MenuDivider />
			<BugButton />
		</MenuList>
	);
}
