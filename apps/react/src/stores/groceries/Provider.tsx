import { hooks, groceriesDescriptor } from './index.js';
import { ReactNode } from 'react';
import { useIsSubscribed } from '@/contexts/AuthContext.jsx';

export function Provider({ children }: { children: ReactNode }) {
	const isSubscribed = useIsSubscribed();

	return (
		<hooks.Provider value={groceriesDescriptor} sync={isSubscribed}>
			{children}
		</hooks.Provider>
	);
}
