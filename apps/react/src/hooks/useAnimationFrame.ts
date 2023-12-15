import { useStableCallback } from '@a-type/ui/hooks';
import { useEffect, useRef } from 'react';

export function useAnimationFrame<Context>(
	callback: (deltaTime: number, context: Context) => void,
	initialContext?: Context,
) {
	const requestRef = useRef<number>();
	const previousTimeRef = useRef<number>();
	const contextRef = useRef<Context>(initialContext!);
	const animate = useStableCallback((time: number) => {
		if (previousTimeRef.current !== undefined) {
			const deltaTime = time - previousTimeRef.current;
			callback(deltaTime, contextRef.current);
		}
		previousTimeRef.current = time;
		requestRef.current = requestAnimationFrame(animate);
	});
	useEffect(() => {
		requestRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(requestRef.current!);
	}, [animate]);
}
