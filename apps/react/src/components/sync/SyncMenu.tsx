import { Box, Button, Span } from '@/components/primitives/index.js';
import {
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverTrigger,
} from '@/components/primitives/Popover.js';
import { useAuth } from '@/contexts/AuthContext.js';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { css, styled } from '@/stitches.config.js';
import { hooks } from '@/stores/groceries/index.js';
import {
	ArrowLeftIcon,
	Cross1Icon,
	ExclamationTriangleIcon,
	HamburgerMenuIcon,
	GlobeIcon,
} from '@radix-ui/react-icons';
import React, { useEffect, useState } from 'react';
import { Tooltip } from '../primitives/Tooltip.js';
import { InviteLinkButton } from './InviteLinkButton.js';
import { LogoutButton } from './LogoutButton.js';
import { ManageSubscriptionButton } from './ManageSubscriptionButton.js';
import { People } from './People.js';
import { StartSignupDialog } from './StartSignupDialog.js';

export function SyncMenu() {
	const { session, error, isSubscribed } = useAuth();

	const online = hooks.useSyncStatus();
	const reconnecting = !online;

	if (session === undefined) {
		return null;
	}

	if (error) {
		return (
			<Container>
				<ExclamationTriangleIcon className={statusIconClass()} />
			</Container>
		);
	}

	if (!session) {
		return <AnonymousSyncMenu />;
	}

	if (reconnecting) {
		return (
			<Container>
				<Tooltip content="Sync reconnecting...">
					<ExclamationTriangleIcon className={statusIconClass()} />
				</Tooltip>
			</Container>
		);
	}

	if (!isSubscribed) {
		return (
			<Container>
				<ExclamationTriangleIcon className={statusIconClass()} />
			</Container>
		);
	}

	return (
		<Container>
			<GlobeIcon className={statusIconClass()} />
			<People />
		</Container>
	);
}

const statusIconClass = css({
	color: '$gray70',
});

const Container = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	gap: '$2',
});

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
