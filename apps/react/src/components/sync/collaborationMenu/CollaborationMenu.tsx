import { Box } from '@/components/primitives/index.js';
import {
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverTrigger,
} from '@/components/primitives/index.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { forwardRef, ReactNode, Suspense } from 'react';
import { InviteLinkButton } from '../InviteLinkButton.jsx';
import { MeetupHint } from '../meetup/MeetupHint.jsx';
import { MeetupSelect } from '../meetup/MeetupSelect.jsx';
import { People } from '../people/People.jsx';
import { SubscribeButton } from '../SubscribeButton.jsx';
import * as classes from './CollaborationMenu.css.js';

export interface CollaborationMenuProps {
	children?: ReactNode;
}

export function CollaborationMenu({ children }: CollaborationMenuProps) {
	return (
		<Suspense fallback={<div className={classes.trigger} />}>
			<Popover>
				<PopoverTrigger asChild>
					<CollaborationMenuTriggerContent className={classes.trigger} />
				</PopoverTrigger>
				<PopoverContent>
					<PopoverArrow />
					<CollaborationMenuContent />
				</PopoverContent>
			</Popover>
		</Suspense>
	);
}

const CollaborationMenuTriggerContent = forwardRef<
	HTMLDivElement,
	{ className?: string }
>(function CollaborationMenuTriggerContent(props, ref) {
	const online = hooks.useSyncStatus();
	const { session, error, isSubscribed } = useAuth();

	if (!session) return null;

	if (error || !online || !isSubscribed) {
		return (
			<div ref={ref} {...props}>
				<DotsHorizontalIcon />
			</div>
		);
	}

	return (
		<div ref={ref} {...props}>
			<MeetupHint className={classes.meetupHint} />
			<People />
		</div>
	);
});

function CollaborationMenuContent() {
	const online = hooks.useSyncStatus();

	if (!online) {
		return <CollaborationMenuOfflineContent />;
	}

	return (
		<Box gap={4}>
			<MeetupSelect />
			<InviteLinkButton
				size="small"
				color="primary"
				style={{ margin: 'auto' }}
			/>
		</Box>
	);
}

function CollaborationMenuOfflineContent() {
	const { session, error, isSubscribed } = useAuth();

	if (error) {
		return <div>Sync is offline. Refresh to try again.</div>;
	}

	if (!session || !isSubscribed) {
		return (
			<div>
				<div>Subscribe for sync and collaboration</div>
				<SubscribeButton />
			</div>
		);
	}

	return <div>Reconnecting...</div>;
}
