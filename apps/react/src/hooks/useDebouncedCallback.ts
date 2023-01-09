import { useRef, useCallback, useEffect } from 'react';

export function useDebouncedCallback<Fn extends (...args: any[]) => any>(
	callback: Fn,
	delay: number,
) {
	const callbackRef = useRef(callback);
	const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	return useCallback(
		(...args: Parameters<Fn>) => {
			const callback = callbackRef.current;

			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				callback(...args);
			}, delay);
		},
		[delay],
	);
}
