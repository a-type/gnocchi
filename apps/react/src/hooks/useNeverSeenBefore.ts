import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { useEffect, useState } from 'react';

export function useNeverSeenBefore(onNeverSeenBefore: () => void) {
	const [seenBefore, setSeenBefore] = useLocalStorage<boolean>(
		'seen-before',
		false,
		false,
	);

	const [neverSeenBefore] = useState(!seenBefore);

	useEffect(() => {
		if (!seenBefore) {
			setSeenBefore(true);
			onNeverSeenBefore();
		}
	}, [seenBefore, setSeenBefore, onNeverSeenBefore]);

	return neverSeenBefore;
}
