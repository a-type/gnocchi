import { useAuth } from '@/contexts/AuthContext.js';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import {
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverTrigger,
} from '@aglio/ui';
import { Button, Span } from '@aglio/ui';
import { ManageCategoriesDialog } from './ManageCategoriesDialog.js';
import { LoginButton } from '../sync/LoginButton.js';
import { ManagePlanButton } from '../sync/ManagePlanButton.js';
import { LogoutButton } from '../auth/LogoutButton.js';
import { BugButton } from './BugButton.js';
import { useSnapshot } from 'valtio';
import { menuState } from './state.js';
import { Box } from '@aglio/ui';
import { useInterval } from '@/hooks/useInterval.js';
import * as classes from './MainMenu.css.js';

export function MainMenu() {
	const { data, error } = useAuth();
	const { session, isSubscribed } = data || {};

	const snap = useSnapshot(menuState);

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
			<PopoverContent collisionPadding={16} align="start" padding="none">
				<PopoverArrow />
				<Contents />
			</PopoverContent>
		</Popover>
	);
}

const contents = {
	offline: OfflineContents,
	anonymous: AnonymousContents,
	unsubscribed: UnsubscribedContents,
	online: OnlineContents,
} as const;

function OfflineContents() {
	const { refetch } = useAuth();

	useInterval(refetch, 3000);

	return (
		<div className={classes.list}>
			<div className={classes.section}>
				<div className={classes.banner}>
					<Span size="sm">Offline</Span>
				</div>
				<Button size="small" color="default" onClick={() => refetch()}>
					Retry connection
				</Button>
				<ManageCategoriesDialog>
					<Button size="small" color="default">
						Manage categories
					</Button>
				</ManageCategoriesDialog>
			</div>
			<div className={classes.section}>
				<BugButton />
			</div>
		</div>
	);
}

function AnonymousContents() {
	return (
		<div className={classes.list}>
			<div className={classes.section}>
				<LoginButton color="primary" size="small" returnTo="/">
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
			</div>
			<div className={classes.section}>
				<BugButton />
			</div>
		</div>
	);
}

function OnlineContents() {
	return (
		<div className={classes.list}>
			<div className={classes.section}>
				<Box flexDirection="row" gap={2}>
					<ManagePlanButton color="default" size="small" />
					<LogoutButton color="default" size="small">
						Log out
					</LogoutButton>
				</Box>
			</div>
			<div className={classes.section}>
				<ManageCategoriesDialog>
					<Button color="default" size="small">
						Manage categories
					</Button>
				</ManageCategoriesDialog>
			</div>
			<div className={classes.section}>
				<BugButton />
			</div>
		</div>
	);
}

function UnsubscribedContents() {
	// user has account but has not completed signup
	return (
		<div className={classes.list}>
			<div className={classes.section}>
				<div className={classes.banner}>
					<Span size="sm">Subscription inactive</Span>
				</div>
				<Box flexDirection="row" gap={2}>
					<ManagePlanButton color="default" size="small" />
					<LogoutButton>Log out</LogoutButton>
				</Box>
			</div>
			<div className={classes.section}>
				<ManageCategoriesDialog>
					<Button color="default" size="small">
						Manage categories
					</Button>
				</ManageCategoriesDialog>
			</div>
			<div className={classes.section}>
				<BugButton />
			</div>
		</div>
	);
}
