import { UserInfo } from '@verdant-web/store';
import { Profile } from '@/stores/groceries/index.js';
import classNames from 'classnames';
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
			className={classNames(
				'flex items-center justify-center rounded-full border-default p-2px overflow-hidden w-24px h-24px select-none relative bg-white',
				popIn &&
					'animate-pop-in-from-half animate-ease-springy animate-duration-200',
				!person && 'border-dashed bg-gray2',
				className,
			)}
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
				className="w-full h-full object-cover rounded-full"
				referrerPolicy="no-referrer"
				crossOrigin="anonymous"
				src={user.profile.imageUrl}
			/>
		);
	}
	return (
		<div className="color-black items-center justify-center flex text-sm font-bold rounded-full">
			{user.profile.name?.charAt(0) || '?'}
		</div>
	);
}
