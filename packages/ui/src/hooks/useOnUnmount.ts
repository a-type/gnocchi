import { useCallback, useRef } from 'react';
import { useStableCallback } from './useStableCallback.js';

/**
 * Calls a callback with an element when it is unmounted.
 * @returns a ref to pass to the component
 */
export function useOnUnmount(callback: (el: HTMLElement) => void) {
	const stableCallback = useStableCallback(callback);

	const ref = useRef<HTMLElement | null>(null);

	return useCallback((el: HTMLElement | null) => {
		console.log(el);
		if (ref.current && !el) {
			stableCallback(ref.current);
		}
		ref.current = el;
	}, []);
}
