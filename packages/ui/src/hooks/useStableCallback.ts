import { useCallback, useEffect, useMemo, useRef } from 'react';

export function useStableCallback<Fn extends (...args: any[]) => any>(
	callback: Fn,
) {
	const ref = useRef(callback);
	useMemo(() => {
		ref.current = callback;
	}, [callback]);
	return useCallback((...args: any[]) => ref.current(...args), []);
}
