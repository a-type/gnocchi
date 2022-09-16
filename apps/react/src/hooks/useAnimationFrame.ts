import { useCallback, useEffect, useRef } from 'react';

export function useAnimationFrame(
	callback: (deltaTime: number) => void,
	deps: any[] = [],
) {
	const requestRef = useRef<number>();
	const previousTimeRef = useRef<number>();
	const animate = useCallback((time: number) => {
		if (previousTimeRef.current !== undefined) {
			const deltaTime = time - previousTimeRef.current;
			callback(deltaTime);
		}
		previousTimeRef.current = time;
		requestRef.current = requestAnimationFrame(animate);
	}, deps);
	useEffect(() => {
		requestRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(requestRef.current!);
	}, deps);
}
