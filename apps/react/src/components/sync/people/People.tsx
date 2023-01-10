import { ErrorBoundary } from '@/components/primitives/ErrorBoundary.js';
import { hooks } from '@/stores/groceries/index.js';
import { PersonAvatar } from './PersonAvatar.js';
import * as classes from './People.css.js';

export function People({ hideIfAlone }: { hideIfAlone?: boolean }) {
	const peerIds = hooks.usePeerIds();

	const syncing = hooks.useSyncStatus();

	if (!syncing || (hideIfAlone && peerIds.length === 0)) {
		return null;
	}

	return (
		<ErrorBoundary>
			<div className={classes.root}>
				<SelfAvatar />
				{peerIds.map((peerId, index) => (
					<PeerAvatar key={peerId} peerId={peerId} index={index} />
				))}
			</div>
		</ErrorBoundary>
	);
}

function SelfAvatar() {
	const self = hooks.useSelf();

	return <PersonAvatar person={self} />;
}

function PeerAvatar({ peerId, index }: { peerId: string; index: number }) {
	const peer = hooks.usePeer(peerId);

	if (!peer) {
		return null;
	}

	return (
		// <Tooltip content={peer.profile?.name}>
		<PersonAvatar person={peer} index={index} />
		// </Tooltip>
	);
}
