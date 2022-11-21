import { useLayoutEffect, useRef } from 'react';
import { useStableCallback } from './useStableCallback.js';
interface ResizeObserverEntry {
	target: Element;
}
type ResizeObserverCallback = (entries: ResizeObserverEntry[]) => void;
export declare class ResizeObserver {
	constructor(callback: ResizeObserverCallback);
	observe(target: Element): void;
	unobserve(target: Element): void;
	disconnect(): void;
}

export function useSize(
	callback: (payload: { width: number; height: number }) => void,
) {
	const ref = useRef<Element>(null);
	const cb = useStableCallback(callback);
	useLayoutEffect(() => {
		const target = ref.current;
		if (!target) {
			return () => {
				//
			};
		}
		const resizeObserver = new ResizeObserver((entries) => {
			entries.forEach((entry) => {
				cb({
					width: entry.target.clientWidth,
					height: entry.target.clientHeight,
				});
			});
		});
		resizeObserver.observe(target);
		return () => {
			resizeObserver.unobserve(target);
			resizeObserver.disconnect();
		};
	}, [ref, cb]);
	return ref;
}
