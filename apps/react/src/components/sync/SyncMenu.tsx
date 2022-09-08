import {
	ExclamationTriangleIcon,
	HamburgerMenuIcon,
	UpdateIcon,
} from '@radix-ui/react-icons';
import { Box, Button, Span } from 'components/primitives/index.js';
import {
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverTrigger,
} from 'components/primitives/Popover.js';
import { API_ORIGIN, SECURE } from 'config.js';
import { useAuth } from 'contexts/AuthContext.js';
import React, { ReactNode, useEffect, useState } from 'react';
import { styled } from 'stitches.config.js';
import { groceries } from 'stores/groceries/index.js';
import { LoginButton } from './LoginButton.js';
import { LogoutButton } from './LogoutButton.js';
import { ManageSubscriptionButton } from './ManageSubscriptionButton.js';
import { People } from './People.js';

export function SyncMenu() {
	const { session, error, refetch, isSubscribed } = useAuth();

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
				<OfflineMenu refetch={refetch} />
				<ExclamationTriangleIcon />
			</Container>
		);
	}

	if (!session) {
		return (
			<LoginButton provider="google" returnTo="/">
				Sync
			</LoginButton>
		);
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
				<ExpiredSyncMenu />
				<ExclamationTriangleIcon />
			</Container>
		);
	}

	return (
		<Container>
			<ActiveSyncMenu status="Sync active" />
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
