import { Button, ButtonProps } from '@aglio/ui/components/button';
import { API_ORIGIN, SECURE } from '@/config.js';
import { ReactNode } from 'react';

export function OAuthSignInButton({
	provider,
	returnTo,
	children,
	className,
	inviteId,
	...rest
}: {
	provider: string;
	returnTo?: string | null;
	children?: ReactNode;
	inviteId?: string | null;
} & ButtonProps) {
	const url = new URL(
		`${SECURE ? 'https' : 'http'}://${API_ORIGIN}/api/auth/${provider}/login`,
	);
	if (returnTo) {
		url.searchParams.set('returnTo', returnTo);
	}
	if (inviteId) {
		url.searchParams.set('inviteId', inviteId);
	}

	return (
		<form action={url.toString()} className={className} method="post">
			<Button type="submit" {...rest}>
				{children}
			</Button>
		</form>
	);
}
