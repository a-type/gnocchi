import { API_ORIGIN, SECURE } from 'config.js';
import React, {
	createContext,
	ReactNode,
	useCallback,
	useEffect,
	useState,
} from 'react';

export const AuthContext = createContext<{
	session?: { userId: string; name: string } | null;
	error?: Error;
	refetch: () => void;
}>({
	refetch: () => {},
});

async function getSession(): Promise<{
	session: { userId: string; name: string } | null;
	error?: Error;
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
				};
			return {
				session: null,
			};
		} else {
			return {
				session: null,
				error: new Error(`Failed to get session: ${meResult.status}`),
			};
		}
	} catch (e) {
		console.error(e);
		return {
			session: null,
			error: e as Error,
		};
	}
}

export function AuthProvider(props: { children: ReactNode }) {
	const [ctx, setCtx] = useState<{
		session: { userId: string; name: string } | undefined | null;
		error?: Error;
	}>({
		session: undefined,
		error: undefined,
	});

	const refetch = useCallback(async () => {
		try {
			const { session, error } = await getSession();
			setCtx({ session, error });
		} catch (e) {
			console.error(e);
			setCtx({ session: null, error: e as Error });
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
