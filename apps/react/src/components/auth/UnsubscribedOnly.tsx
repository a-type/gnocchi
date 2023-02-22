import { useIsSubscribed } from '@/contexts/AuthContext.jsx';
import { ReactNode } from 'react';

export interface UnsubscribedOnlyProps {
	children?: ReactNode;
}

export function UnsubscribedOnly({ children }: UnsubscribedOnlyProps) {
	const isSubscribed = useIsSubscribed();

	if (isSubscribed) {
		return null;
	}

	return <>{children}</>;
}
