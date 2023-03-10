import { useIsSubscribed, useIsUnsubscribed } from '@/contexts/AuthContext.jsx';
import { ReactNode } from 'react';

export interface UnsubscribedOnlyProps {
	children?: ReactNode;
}

export function UnsubscribedOnly({ children }: UnsubscribedOnlyProps) {
	const isUnsubscribed = useIsUnsubscribed();

	if (!isUnsubscribed) {
		return null;
	}

	return <>{children}</>;
}
