import {
	ArrowLeftIcon,
	Cross1Icon,
	ExclamationTriangleIcon,
	HamburgerMenuIcon,
	UpdateIcon,
} from '@radix-ui/react-icons';
import { Box, Button, H1, H2, P, Span } from '@/components/primitives/index.js';
import {
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverTrigger,
} from '@/components/primitives/Popover.js';
import { useAuth } from '@/contexts/AuthContext.js';
import React, { ReactNode, useEffect, useState } from 'react';
import { styled } from '@/stitches.config.js';
import { groceries } from '@/stores/groceries/index.js';
import { InviteLinkButton } from './InviteLinkButton.js';
import { LoginButton } from './LoginButton.js';
import { LogoutButton } from './LogoutButton.js';
import { ManageSubscriptionButton } from './ManageSubscriptionButton.js';
import { People } from './People.js';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '../primitives/Dialog.js';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { StartSignupDialog } from './StartSignupDialog.js';

export function SyncMenu() {
	const { session, error, isSubscribed } = useAuth();

	const [reconnecting, setReconnecting] = useState(false);

	useEffect(() => {
		return groceries.sync.subscribe('onlineChange', (online) => {
			setReconnecting(!online);
		});
	}, []);

	if (session === undefined) {
		return null;
	}

	if (error) {
		return (
			<Container>
				<ExclamationTriangleIcon />
			</Container>
		);
	}

	if (!session) {
		return <AnonymousSyncMenu />;
	}

	if (reconnecting) {
		return (
			<Container>
				<ExclamationTriangleIcon />
				<Span size="small">Reconnecting...</Span>
			</Container>
		);
	}

	if (!isSubscribed) {
		return (
			<Container>
				<ExclamationTriangleIcon />
			</Container>
		);
	}

	return (
		<Container>
			<UpdateIcon />
			<People />
		</Container>
	);
}

const Container = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	gap: '$2',
});

function ActiveSyncMenu({ status }: { status: string }) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button size="small" color="ghost">
					<HamburgerMenuIcon />
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<PopoverArrow />
				<Box direction="column" gap="2">
					<Span size="small">{status}</Span>
					<ManageSubscriptionButton />
					<InviteLinkButton />
					<LogoutButton>Log out</LogoutButton>
				</Box>
			</PopoverContent>
		</Popover>
	);
}

function ExpiredSyncMenu() {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button size="small" color="ghost">
					<HamburgerMenuIcon />
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<PopoverArrow />
				<Box direction="column" gap="2">
					<Span size="small">Subscription expired</Span>
					<ManageSubscriptionButton />
					<LogoutButton>Log out</LogoutButton>
				</Box>
			</PopoverContent>
		</Popover>
	);
}

function OfflineMenu({ refetch }: { refetch: () => void }) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button size="small" color="ghost">
					<HamburgerMenuIcon />
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<PopoverArrow />
				<Box direction="column" gap="2">
					<Span size="small">Offline</Span>
					<Button color="default" onClick={refetch}>
						Retry connection
					</Button>
				</Box>
			</PopoverContent>
		</Popover>
	);
}

function AnonymousSyncMenu() {
	const [collapsed, setCollapsed] = useLocalStorage(
		'subscribe-dismissed',
		false,
	);
	const [hasBeenCollapsed, setHasBeenCollapsed] = useState(!collapsed);
	const queueHasBeenCollapsedTimer = collapsed && hasBeenCollapsed;
	useEffect(() => {
		if (queueHasBeenCollapsedTimer) {
			const timer = setTimeout(() => {
				setHasBeenCollapsed(false);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [queueHasBeenCollapsedTimer]);

	return (
		<SubscribeBanner collapsed={collapsed}>
			{!collapsed ? (
				<StartSignupDialog>
					<Button
						color={collapsed ? 'ghost' : 'primary'}
						size={collapsed ? 'small' : 'default'}
						css={{ gridArea: 'cta', gap: '$2' }}
					>
						Subscribe
					</Button>
				</StartSignupDialog>
			) : hasBeenCollapsed ? (
				<Box direction="row" gap={3} align="center">
					<ArrowLeftIcon />
					<Span>You can sign up from here</Span>
				</Box>
			) : null}
			{!collapsed && (
				<>
					<Box flex={1} css={{ color: '$darkBlend', gridArea: 'pitch' }}>
						Sync to your devices, share with family and friends, and more.
					</Box>
					<Button
						onClick={() => setCollapsed(true)}
						size="small"
						color="ghost"
						css={{ gridArea: 'close', width: 'auto' }}
					>
						<Cross1Icon />
					</Button>
				</>
			)}
		</SubscribeBanner>
	);
}

const SubscribeBanner = styled('div', {
	background: '$lemonLight',
	borderRadius: '$md',
	gap: '$4',

	display: 'grid',
	gridTemplateAreas: '"pitch pitch pitch" "cta _ close"',
	gridTemplateColumns: 'auto 1fr auto',

	transition: '0.2s ease all',

	'@sm': {
		gridTemplateAreas: '"cta pitch close"',
		gridTemplateColumns: 'auto 1fr auto',
	},

	variants: {
		collapsed: {
			true: {
				background: 'transparent',
				p: 0,
			},
			false: {
				p: '$6',
				background: '$lemonLight',
			},
		},
	},
});
