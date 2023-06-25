import { API_ORIGIN, SECURE } from '@/config.js';
import { useQuery } from '@tanstack/react-query';

async function getSession(): Promise<{
	session: { userId: string; name: string; role: 'admin' | 'member' } | null;
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
			if (json.session) {
				return {
					session: json.session,
					isSubscribed: !json.planStatus,
					subscriptionStatus: json.planStatus || null,
				};
			}
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
			throw new Error(`Failed to get session: ${meResult.status}`);
		}
	} catch (e) {
		console.error(e);
		throw e;
	}
}

export function useAuth() {
	return useQuery(['session'], getSession, {
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchInterval: false,
	});
}

export function useIsSubscribed() {
	const { data } = useAuth();
	return data?.isSubscribed;
}

export function useIsUnsubscribed() {
	const { data, error, isInitialLoading } = useAuth();
	return !isInitialLoading && !data?.isSubscribed && !error;
}

export function useIsLoggedIn() {
	const { data, isInitialLoading } = useAuth();
	return !isInitialLoading && !!data?.session;
}
