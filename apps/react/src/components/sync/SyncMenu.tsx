import { Box, Button } from 'components/primitives/index.js';
import { API_ORIGIN, SECURE } from 'config.js';
import { useAuth } from 'contexts/AuthContext.js';
import React, { ReactNode } from 'react';

export function SyncMenu() {
	const session = useAuth();

	if (session === undefined) {
		return null;
	}

	if (!session) {
		return <OAuthLoginButton provider="google">Sync</OAuthLoginButton>;
	}

	return (
		<Box direction="row" align="center" gap={2}>
			Syncing<LogoutButton>Logout</LogoutButton>
		</Box>
	);
}

function OAuthLoginButton({
	provider,
	returnTo,
	children,
	...rest
}: {
	provider: string;
	returnTo?: string;
	children?: ReactNode;
}) {
	return (
		<form
			action={`${
				SECURE ? 'https' : 'http'
			}://${API_ORIGIN}/api/auth/${provider}/login${
				returnTo ? `?returnTo=${returnTo}` : ''
			}`}
			method="post"
			{...rest}
		>
			<Button type="submit">{children}</Button>
		</form>
	);
}

function LogoutButton({ children, ...rest }: { children?: ReactNode }) {
	return (
		<form
			action={`${SECURE ? 'https' : 'http'}://${API_ORIGIN}/api/auth/logout`}
			method="post"
			{...rest}
		>
			<Button type="submit">{children}</Button>
		</form>
	);
}
