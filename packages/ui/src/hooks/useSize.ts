import { debounce } from '@a-type/utils';
import { RefObject, useLayoutEffect, useMemo, useRef } from 'react';
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

export function useSizeCssVars<E extends HTMLElement>(
	debounceMs?: number,
	applyToRef?: RefObject<HTMLElement>,
	propertyNames?: { width: string; height: string },
) {
	const update = useMemo(() => {
		const doupdate = ({ width, height }: { width: number; height: number }) => {
			const usedRef = applyToRef || ref;
			usedRef.current?.style.setProperty(
				propertyNames?.width ?? '--width',
				width + 'px',
			);
			usedRef.current?.style.setProperty(
				propertyNames?.height ?? '--height',
				height + 'px',
			);
		};
		if (debounceMs) {
			return debounce(doupdate, debounceMs);
		} else {
			return doupdate;
		}
	}, [debounceMs, applyToRef, propertyNames?.width, propertyNames?.height]);
	const ref = useSize<E>(update);
	return ref;
}

export function useBounds<E extends HTMLElement>(
	callback: (payload: {
		left: number;
		top: number;
		width: number;
		height: number;
	}) => void,
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
				const { left, top, width, height } =
					entry.target.getBoundingClientRect();
				cb({ left, top, width, height });
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

export function useBoundsCssVars<E extends HTMLElement>(
	debounceMs?: number,
	applyToRef?: RefObject<HTMLElement>,
	propertyNames?: {
		left: string;
		top: string;
		width: string;
		height: string;
		ready: string;
	},
) {
	const update = useMemo(() => {
		const doupdate = ({
			left,
			top,
			width,
			height,
		}: {
			left: number;
			top: number;
			width: number;
			height: number;
		}) => {
			const usedRef = applyToRef || ref;
			usedRef.current?.style.setProperty(
				propertyNames?.left ?? '--left',
				left + 'px',
			);
			usedRef.current?.style.setProperty(
				propertyNames?.top ?? '--top',
				top + 'px',
			);
			usedRef.current?.style.setProperty(
				propertyNames?.width ?? '--width',
				width + 'px',
			);
			usedRef.current?.style.setProperty(
				propertyNames?.height ?? '--height',
				height + 'px',
			);
			usedRef.current?.style.setProperty(
				propertyNames?.ready ?? '--ready',
				'1',
			);
		};
		if (debounceMs) {
			return debounce(doupdate, debounceMs);
		} else {
			return doupdate;
		}
	}, [
		debounceMs,
		applyToRef,
		propertyNames?.left,
		propertyNames?.top,
		propertyNames?.width,
		propertyNames?.height,
	]);
	const ref = useBounds<E>(update);
	return ref;
}
