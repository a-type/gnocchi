import { useDndMonitor } from '@dnd-kit/core';
import { useEffect, useRef, useState } from 'react';

export function useIsDragging() {
	const [isDragging, setIsDragging] = useState(false);
	useDndMonitor({
		onDragStart: () => {
			setIsDragging(true);
		},
		onDragEnd: () => {
			setIsDragging(false);
		},
		onDragCancel: () => {
			setIsDragging(false);
		},
	});
	return isDragging;
}

export function useDragDistance(
	percentageOf: number,
	cb: (num: number) => void,
	after?: (finalVal: number) => void,
) {
	const [active, setActive] = useState(false);
	const totalMovementRef = useRef(0);
	useEffect(() => {
		if (typeof window === 'undefined') return;

		function onPointerMove(event: PointerEvent) {
			if (!active) return;
			totalMovementRef.current += vectorDistance({
				x: event.movementX,
				y: event.movementY,
			});
			cb(Math.min(Math.max(totalMovementRef.current / percentageOf, 0), 1));
		}
		function onPointerUp() {
			if (!active) return;
			setActive(false);
			after?.(
				Math.min(Math.max(totalMovementRef.current / percentageOf, 0), 1),
			);
			totalMovementRef.current = 0;
		}
		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', onPointerUp);
		return () => {
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerup', onPointerUp);
		};
	});
	useDndMonitor({
		onDragEnd: () => {
			totalMovementRef.current = 0;
			setActive(false);
		},
		onDragCancel: () => {
			totalMovementRef.current = 0;
			setActive(false);
		},
		onDragStart: () => {
			cb(0);
			totalMovementRef.current = 0;
			setActive(true);
		},
	});
}
function vectorDistance(vector: { x: number; y: number }) {
	return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}
