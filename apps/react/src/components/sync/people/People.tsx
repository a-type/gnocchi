import { ErrorBoundary } from '@aglio/ui';
import { hooks } from '@/stores/groceries/index.js';
import { PersonAvatar } from './PersonAvatar.js';
import * as classes from './People.css.js';
import { ReactNode } from 'react';

export function People({
	hideIfAlone,
	avatarClassName,
}: {
	hideIfAlone?: boolean;
	avatarClassName?: string;
}) {
	const peerIds = hooks.usePeerIds();

	const syncing = hooks.useSyncStatus();

	if (!syncing || (hideIfAlone && peerIds.length === 0)) {
		return null;
	}

	return (
		<ErrorBoundary>
			<PeopleList count={peerIds.length + 1}>
				<SelfAvatar className={avatarClassName} />
				{peerIds.map((peerId, index) => (
					<PeerAvatar
						key={peerId}
						peerId={peerId}
						index={index + 1}
						className={avatarClassName}
					/>
				))}
			</PeopleList>
		</ErrorBoundary>
	);
}

export function PeopleList({
	children,
	count,
}: {
	children: ReactNode;
	count: number;
}) {
	const width = count > 0 ? 24 + (count - 1) * 16 : 0;

	return (
		<div className={classes.root} style={{ width, minWidth: width }}>
			{children}
		</div>
	);
}

export function PeopleListItem({
	index,
	children,
}: {
	index: number;
	children: ReactNode;
}) {
	return (
		<div
			className={classes.person}
			style={{ left: index === 0 ? 0 : index * 16, zIndex: index, top: 0 }}
		>
			{children}
		</div>
	);
}

function SelfAvatar({ className }: { className?: string }) {
	const self = hooks.useSelf();

	return <PersonAvatar person={self} className={className} />;
}

function PeerAvatar({
	peerId,
	index,
	className,
}: {
	peerId: string;
	index: number;
	className?: string;
}) {
	const peer = hooks.usePeer(peerId);

	if (!peer) {
		return null;
	}

	return (
		<PeopleListItem index={index}>
			<PersonAvatar person={peer} className={className} />
		</PeopleListItem>
	);
}
