import { UserInfo } from '@lo-fi/web';
import { Profile } from '@/stores/groceries/index.js';
import { clsx } from 'clsx';
import * as classes from './PersonAvatar.css.js';
import { PersonIcon } from '@radix-ui/react-icons';

export function PersonAvatar({
	person,
	className,
	index,
	popIn = true,
	...rest
}: {
	person: UserInfo<Profile, any> | null;
	className?: string;
	index?: number;
	popIn?: boolean;
}) {
	return (
		<div
			data-pop={popIn}
			data-index={index}
			className={clsx(classes.root, !person && classes.empty, className)}
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
