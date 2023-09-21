import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { useEffect, useState } from 'react';

export function useNeverSeenBefore(onNeverSeenBefore?: () => void) {
	const [seenBefore, setSeenBefore] = useLocalStorage<number>(
		'last-seen',
		0,
		false,
	);

	const [neverSeenBefore] = useState(seenBefore === 0);

	useEffect(() => {
		if (!seenBefore) {
			setSeenBefore(Date.now());
			onNeverSeenBefore?.();
		}
	}, [seenBefore, setSeenBefore, onNeverSeenBefore]);

	return neverSeenBefore;
}
