import {
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

	return (
		<SubscribeBanner collapsed={collapsed}>
			<Dialog>
				<DialogTrigger asChild>
					<Button
						color={collapsed ? 'ghost' : 'primary'}
						size={collapsed ? 'small' : 'default'}
						css={{ gridArea: 'cta', gap: '$2' }}
					>
						{collapsed ? <UpdateIcon /> : null}
						{collapsed ? 'Sync' : 'Subscribe'}
					</Button>
				</DialogTrigger>
				<DialogContent>
					<Box direction="row" align="start" gap={2}>
						<DialogTitle css={{ flex: 1 }}>
							Subscribe for sync &amp; more
						</DialogTitle>
						<DialogClose asChild>
							<Button size="small" color="ghost">
								<Cross1Icon />
							</Button>
						</DialogClose>
					</Box>
					<P>Make Aglio your household's new grocery list.</P>
					<H2>Sync with family or roommates so everyone's on the same page</H2>
					<P>Everyone you invite can add items to the list.</P>
					<H2>Team up at the store with live collaboration</H2>
					<P>
						See who's buying what, assign aisles, and easily tell fellow
						shoppers where to meet up.
					</P>
					<H2>Coordinate with folks at home</H2>
					<P>
						Has the milk gone bad? Ask a question right in the app, and a friend
						or partner will get a push notification to check the fridge for you
						while you're at the store.
					</P>

					<Box gap={2} align="center" css={{ m: 'auto', mt: '$8' }}>
						<LoginButton provider="google" returnTo="/">
							Start your subscription
						</LoginButton>
						<Span size="xs">
							14 days free. Unlimited devices and collaborators.
						</Span>
					</Box>
				</DialogContent>
			</Dialog>
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
