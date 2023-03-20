import { useIsSubscribed, useIsUnsubscribed } from '@/hooks/useAuth.jsx';
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
