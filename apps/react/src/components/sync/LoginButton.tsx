import { LinkButton, LinkButtonProps } from '@/components/nav/Link.jsx';
import { ReactNode, forwardRef } from 'react';

export const LoginButton = forwardRef<
	HTMLAnchorElement,
	{
		returnTo?: string;
		children?: ReactNode;
		inviteId?: string;
	} & Omit<LinkButtonProps, 'to'>
>(function LoginButton(
	{ returnTo, children, className, inviteId, ...rest },
	ref,
) {
	return (
		<LinkButton
			className={className}
			to={`/join${returnTo ? `?returnTo=${returnTo}` : ''}`}
			{...rest}
			ref={ref}
		>
			{children}
		</LinkButton>
	);
});
