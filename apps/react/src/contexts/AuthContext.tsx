import { API_ORIGIN, SECURE } from '@/config.js';
import React, {
	createContext,
	ReactNode,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { useQuery } from '@tanstack/react-query';

export const AuthContext = createContext<{
	session?: { userId: string; name: string; planId?: string } | null;
	error?: Error;
	refetch: () => void;
	isSubscribed: boolean;
	subscriptionStatus: string | null;
	initializing: boolean;
}>({
	refetch: () => {},
	isSubscribed: false,
	subscriptionStatus: null,
	initializing: true,
});

async function getSession(): Promise<{
	session: { userId: string; name: string } | null;
	error?: Error;
	isSubscribed: boolean;
	// any error in the subscription
	subscriptionStatus: string | null;
}> {
	try {
		const meResult = await fetch(
			`${SECURE ? 'https' : 'http'}://${API_ORIGIN}/api/auth/session`,
			{
				credentials: 'include',
			},
		);
		if (meResult.ok) {
			const json = await meResult.json();
			if (json.session)
				return {
					session: json.session,
					isSubscribed: !json.planStatus,
					subscriptionStatus: json.planStatus || null,
				};
			return {
				session: null,
				isSubscribed: false,
				subscriptionStatus: null,
			};
		} else {
			if (meResult.status === 401) {
				return {
					session: null,
					isSubscribed: false,
					subscriptionStatus: null,
				};
			}
			return {
				session: null,
				error: new Error(`Failed to get session: ${meResult.status}`),
				isSubscribed: false,
				subscriptionStatus: null,
			};
		}
	} catch (e) {
		console.error(e);
		return {
			session: null,
			error: e as Error,
			isSubscribed: false,
			subscriptionStatus: null,
		};
	}
}

export function AuthProvider(props: { children: ReactNode }) {
	const { data, refetch, isInitialLoading } = useQuery(
		['session'],
		getSession,
		{},
	);

	useEffect(() => {
		// yes, this will run twice in dev mode...
		refetch();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				isSubscribed: false,
				session: undefined,
				error: undefined,
				subscriptionStatus: null,
				...data,
				refetch,
				initializing: isInitialLoading,
			}}
			{...props}
		/>
	);
}

export function useAuth() {
	return React.useContext(AuthContext);
}

export function useIsSubscribed() {
	const { isSubscribed } = React.useContext(AuthContext);
	return isSubscribed;
}

export function useIsLoggedIn() {
	const { session, initializing } = React.useContext(AuthContext);
	return !initializing && !!session;
}
