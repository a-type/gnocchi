import { useEffect, useRef } from 'react';
import { useEffectOnce } from './useEffectOnce.js';

export function useUnmount(fn: () => void) {
	const fnRef = useRef(fn);
	fnRef.current = fn;
	useEffectOnce(() => () => fnRef.current());
}
