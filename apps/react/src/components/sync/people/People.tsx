import { ErrorBoundary } from '@/components/primitives/ErrorBoundary.js';
import React from 'react';
import { styled } from '@/stitches.config.js';
import { hooks } from '@/stores/groceries/index.js';
import { PersonAvatar } from './PersonAvatar.js';

export function People() {
	const peerIds = hooks.usePeerIds();

	const syncing = hooks.useSyncStatus();

	if (!syncing) {
		return null;
	}

	return (
		<ErrorBoundary>
			<Container>
				<SelfAvatar />
				{peerIds.map((peerId) => (
					<PeerAvatar key={peerId} peerId={peerId} />
				))}
			</Container>
		</ErrorBoundary>
	);
}

const Container = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	gap: '$1',
});

function SelfAvatar() {
	const self = hooks.useSelf();

	return <PersonAvatar person={self} />;
}

function PeerAvatar({ peerId }: { peerId: string }) {
	const peer = hooks.usePeer(peerId);

	if (!peer) {
		return null;
	}

	return (
		// <Tooltip content={peer.profile?.name}>
		<PersonAvatar person={peer} />
		// </Tooltip>
	);
}
