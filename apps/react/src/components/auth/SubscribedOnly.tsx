import { useIsSubscribed } from '@/hooks/useAuth.jsx';
import { ReactNode } from 'react';

export interface SubscribedOnlyProps {
	children?: ReactNode;
}

export function SubscribedOnly({ children }: SubscribedOnlyProps) {
	const isSubscribed = useIsSubscribed();

	if (!isSubscribed) {
		return null;
	}

	return <>{children}</>;
}
