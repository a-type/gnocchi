import { API_ORIGIN, SECURE } from 'config.js';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

export const AuthContext = createContext<{
	session?: { userId: string; name: string } | null;
}>({});

async function getSession() {
	try {
		const meResult = await fetch(
			`${SECURE ? 'https' : 'http'}://${API_ORIGIN}/api/auth/session`,
			{
				credentials: 'include',
			},
		);
		if (meResult.ok) {
			const json = await meResult.json();
			if (json.session) return json.session;
			return null;
		}
	} catch (e) {
		console.error(e);
	}
}

export function AuthProvider(props: { children: ReactNode }) {
	const [session, setSession] = useState<
		{ userId: string; name: string } | undefined | null
	>();

	useEffect(() => {
		// yes, this will run twice in dev mode...
		getSession()
			.then(setSession)
			.catch(() => {
				setSession(null);
			});
	}, []);

	return <AuthContext.Provider value={{ session }} {...props} />;
}

export function useAuth() {
	return React.useContext(AuthContext).session;
}
