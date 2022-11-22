import React from 'react';
import { keyframes, styled } from '@/stitches.config.js';
import { UserInfo } from '@lo-fi/web';

export function PersonAvatar({
	person,
	...rest
}: {
	person: UserInfo;
	popIn?: boolean;
	className?: string;
}) {
	return (
		<Avatar popIn {...rest}>
			<AvatarContent user={person} />
		</Avatar>
	);
}

const popIn = keyframes({
	'0%': { opacity: 0, transform: 'scale(0.5)' },
	'100%': { opacity: 1, transform: 'scale(1)' },
});

const Avatar = styled('div', {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',

	borderRadius: '100%',
	border: '1px solid $black',
	padding: '2px',
	overflow: 'hidden',

	variants: {
		popIn: {
			true: {
				animation: `${popIn} 0.2s $transitions$springy`,
			},
			false: {},
		},
	},
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

function AvatarContent({ user }: { user: UserInfo }) {
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
