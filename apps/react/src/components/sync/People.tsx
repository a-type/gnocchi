import { UserInfo } from '@aglio/storage-common';
import { ErrorBoundary } from '@/components/primitives/ErrorBoundary.js';
import React from 'react';
import { styled } from '@/stitches.config.js';
import { hooks } from '@/stores/groceries/index.js';
import { Presence, Profile } from '@aglio/storage';

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

function SelfAvatar() {
	const self = hooks.useSelf();

	return (
		<Avatar>
			<AvatarContent user={self} />
		</Avatar>
	);
}

function PeerAvatar({ peerId }: { peerId: string }) {
	const peer = hooks.usePeer(peerId);

	if (!peer) {
		return null;
	}

	return (
		// <Tooltip content={peer.profile?.name}>
		<Avatar>
			<AvatarContent user={peer} />
		</Avatar>
		// </Tooltip>
	);
}

const Container = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	gap: '$1',
});

const Avatar = styled('div', {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',

	borderRadius: '100%',
	border: '1px solid $black',
	padding: '2px',
	overflow: 'hidden',
});

const AvatarImage = styled('img', {
	width: '24px',
	height: '24px',
	objectFit: 'cover',
	borderRadius: '100%',
});

const Initials = styled('div', {
	display: 'flex',
	alignItems: 'center',
	fontSize: '12px',
	fontWeight: 'bold',
	color: '$black',
	width: '24px',
	height: '24px',
	borderRadius: '100%',
});

function AvatarContent({ user }: { user: UserInfo<Profile, Presence> }) {
	if (user.profile?.imageUrl) {
		return (
			<AvatarImage
				referrerPolicy="no-referrer"
				crossOrigin="anonymous"
				src={user.profile.imageUrl}
			/>
		);
	}
	return <Initials>{user.profile.name?.charAt(0) || '?'}</Initials>;
}
