import { LinkButton, LinkButtonProps } from '@/components/primitives/index.js';
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
