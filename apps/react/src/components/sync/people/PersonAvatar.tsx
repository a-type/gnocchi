import { keyframes, styled } from '@/stitches.config.js';
import { UserInfo } from '@lo-fi/web';
import { Presence, Profile } from '@/stores/groceries/index.js';
import { clsx } from 'clsx';
import * as classes from './PersonAvatar.css.js';

export function PersonAvatar({
	person,
	className,
	index,
	...rest
}: {
	person: UserInfo<Profile, Presence>;
	className?: string;
	index?: number;
}) {
	return (
		<div
			data-pop
			data-index={index}
			className={clsx(classes.root, className)}
			{...rest}
		>
			<AvatarContent user={person} />
		</div>
	);
}

function AvatarContent({ user }: { user: UserInfo<Profile, Presence> }) {
	if (user.profile?.imageUrl) {
		return (
			<img
				className={classes.image}
				referrerPolicy="no-referrer"
				crossOrigin="anonymous"
				src={user.profile.imageUrl}
			/>
		);
	}
	return (
		<div className={classes.initials}>
			{user.profile.name?.charAt(0) || '?'}
		</div>
	);
}
