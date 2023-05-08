import { UserInfo } from '@verdant-web/store';
import { Profile } from '@/stores/groceries/index.js';
import classNames from 'classnames';
import * as classes from './PersonAvatar.css.js';
import { PersonIcon } from '@radix-ui/react-icons';
import { CSSProperties } from 'react';

export function PersonAvatar({
	person,
	className,
	popIn = true,
	...rest
}: {
	person: UserInfo<Profile, any> | null;
	className?: string;
	popIn?: boolean;
	style?: CSSProperties;
}) {
	return (
		<div
			data-pop={popIn}
			className={classNames(classes.root, !person && classes.empty, className)}
			{...rest}
		>
			{person && <AvatarContent user={person} />}
			{!person && <PersonIcon />}
		</div>
	);
}

function AvatarContent({ user }: { user: UserInfo<Profile, any> }) {
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
