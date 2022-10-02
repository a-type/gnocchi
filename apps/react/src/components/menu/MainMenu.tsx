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
import { Button, Span } from '../primitives/primitives.js';
import { styled } from '@/stitches.config.js';
import { ManageCategoriesDialog } from './ManageCategoriesDialog.js';
import { LoginButton } from '../sync/LoginButton.js';
import { ManageSubscriptionButton } from '../sync/ManageSubscriptionButton.js';
import { InviteLinkButton } from '../sync/InviteLinkButton.js';
import { LogoutButton } from '../sync/LogoutButton.js';

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
			<PopoverContent collisionPadding={16}>
				<PopoverArrow />
				<Contents />
			</PopoverContent>
		</Popover>
	);
}

const MenuList = styled('div' as const, {
	display: 'flex',
	flexDirection: 'column',
	gap: '$2',
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

function OfflineContents() {
	const { refetch } = useAuth();
	return (
		<MenuList>
			<Span size="small">Offline</Span>
			<Button color="default" onClick={refetch}>
				Retry connection
			</Button>
			<ManageCategoriesDialog>
				<Button color="ghost">Manage categories</Button>
			</ManageCategoriesDialog>
		</MenuList>
	);
}

function AnonymousContents() {
	return (
		<MenuList>
			<LoginButton provider="google" returnTo="/">
				Start syncing
			</LoginButton>
			<Span size="xs">
				14 days free. Unlimited devices and collaborators. Cancel anytime.
			</Span>
			<ManageCategoriesDialog>
				<Button color="ghost">Manage categories</Button>
			</ManageCategoriesDialog>
		</MenuList>
	);
}

function OnlineContents() {
	return (
		<MenuList>
			<Span size="small">Syncing</Span>
			<ManageSubscriptionButton color="ghost" />
			<InviteLinkButton />
			<ManageCategoriesDialog>
				<Button color="ghost">Manage categories</Button>
			</ManageCategoriesDialog>
			<LogoutButton color="ghost">Log out</LogoutButton>
		</MenuList>
	);
}

function UnsubscribedContents() {
	// user has account but has not completed signup
	return (
		<MenuList>
			<Span size="small">Subscription inactive</Span>
			<ManageSubscriptionButton />
			<ManageCategoriesDialog>
				<Button color="ghost">Manage categories</Button>
			</ManageCategoriesDialog>
			<LogoutButton>Log out</LogoutButton>
		</MenuList>
	);
}
