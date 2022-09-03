import { ExclamationTriangleIcon, UpdateIcon } from '@radix-ui/react-icons';
import { Box, Button } from 'components/primitives/index.js';
import { API_ORIGIN, SECURE } from 'config.js';
import { useAuth } from 'contexts/AuthContext.js';
import React, { ReactNode, useEffect, useState } from 'react';
import { styled } from 'stitches.config.js';
import { groceries } from 'stores/groceries/index.js';

export function SyncMenu() {
	const { session, error, refetch } = useAuth();

	const [reconnecting, setReconnecting] = useState(false);

	useEffect(() => {
		return groceries.sync.subscribe('onlineChange', (online) => {
			setReconnecting(!online);
		});
	}, []);

	if (session === undefined) {
		return null;
	}

	if (error) {
		return (
			<Container>
				<ExclamationTriangleIcon />
				<span>Offline</span>
				<Button color="default" onClick={refetch}>
					Retry
				</Button>
			</Container>
		);
	}

	if (reconnecting) {
		return (
			<Container>
				<ExclamationTriangleIcon />
				<span>Reconnecting...</span>
			</Container>
		);
	}

	if (!session) {
		return <OAuthLoginButton provider="google">Sync</OAuthLoginButton>;
	}

	return (
		<Container>
			<UpdateIcon />
			<span>Syncing</span>
			<LogoutButton>Logout</LogoutButton>
		</Container>
	);
}

const Container = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	gap: '$2',
});

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
			<Button type="submit" color="ghost">
				{children}
			</Button>
		</form>
	);
}
