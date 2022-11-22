import { debounce } from '@a-type/utils';
import { useLayoutEffect, useMemo, useRef } from 'react';
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

export function useSize<E extends HTMLElement>(
	callback: (payload: { width: number; height: number }) => void,
) {
	const ref = useRef<E>(null);
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

export function useSizeCssVars<E extends HTMLElement>(debounceMs?: number) {
	const update = useMemo(() => {
		const doupdate = ({ width, height }: { width: number; height: number }) => {
			ref.current?.style.setProperty('--width', width + 'px');
			ref.current?.style.setProperty('--height', height + 'px');
		};
		if (debounceMs) {
			return debounce(doupdate, debounceMs);
		} else {
			return doupdate;
		}
	}, [debounceMs]);
	const ref = useSize<E>(update);
	return ref;
}
