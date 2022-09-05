import { API_ORIGIN, SECURE } from 'config.js';
import React, {
	createContext,
	ReactNode,
	useCallback,
	useEffect,
	useState,
} from 'react';

export const AuthContext = createContext<{
	session?: { userId: string; name: string; planId?: string } | null;
	error?: Error;
	refetch: () => void;
	isSubscribed: boolean;
	subscriptionStatus: string | null;
}>({
	refetch: () => {},
	isSubscribed: false,
	subscriptionStatus: null,
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
	const [ctx, setCtx] = useState<{
		session: { userId: string; name: string } | undefined | null;
		error?: Error;
		isSubscribed: boolean;
		subscriptionStatus: string | null;
	}>({
		session: undefined,
		error: undefined,
		isSubscribed: false,
		subscriptionStatus: null,
	});

	const refetch = useCallback(async () => {
		try {
			const data = await getSession();
			setCtx(data);
		} catch (e) {
			console.error(e);
			setCtx({
				session: null,
				error: e as Error,
				isSubscribed: false,
				subscriptionStatus: null,
			});
		}
	}, []);

	useEffect(() => {
		// yes, this will run twice in dev mode...
		refetch();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				...ctx,
				refetch,
			}}
			{...props}
		/>
	);
}

export function useAuth() {
	return React.useContext(AuthContext);
}
