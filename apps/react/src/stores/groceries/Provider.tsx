import { hooks, groceriesDescriptor } from './index.js';
import { ReactNode } from 'react';
import { useIsSubscribed } from '@/hooks/useAuth.jsx';

export function Provider({ children }: { children: ReactNode }) {
	const isSubscribed = useIsSubscribed();

	return (
		<hooks.Provider value={groceriesDescriptor} sync={isSubscribed}>
			{children}
		</hooks.Provider>
	);
}
