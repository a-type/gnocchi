import React from 'react';
import { styled } from '@/stitches.config.js';
import { Presence, Profile } from '@aglio/storage';
import { UserInfo } from '@aglio/storage-common';

export function PersonAvatar({
	person,
}: {
	person: UserInfo<Profile, Presence>;
}) {
	return (
		<Avatar>
			<AvatarContent user={person} />
		</Avatar>
	);
}

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
