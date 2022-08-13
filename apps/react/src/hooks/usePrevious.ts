import { useEffect, useRef } from 'react';

export function usePrevious<T>(value: T): T | undefined {
	const ref = useRef<T>();
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
}

// this is only an approximation unfortunately...
// React concurrent mode re-fires effects
// so the simple way doesn't work anymore
export function useIsFirstRender() {
	const ref = useRef(true);
	useEffect(() => {
		requestAnimationFrame(() => {
			ref.current = false;
		});
	}, []);
	return ref;
}
