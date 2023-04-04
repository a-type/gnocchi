import { LinkButton, LinkButtonProps } from '@/components/nav/Link.jsx';
import { ReactNode } from 'react';

export function LoginButton({
	returnTo,
	children,
	className,
	inviteId,
	...rest
}: {
	returnTo?: string;
	children?: ReactNode;
	inviteId?: string;
} & Omit<LinkButtonProps, 'to'>) {
	return (
		<LinkButton
			className={className}
			to={`/join?returnTo=${returnTo}`}
			{...rest}
		>
			{children}
		</LinkButton>
	);
}
