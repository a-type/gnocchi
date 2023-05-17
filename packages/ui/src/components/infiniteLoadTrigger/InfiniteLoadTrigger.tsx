import { ReactNode, forwardRef, useEffect, useRef } from 'react';
import classNames from 'classnames';
import useMergedRef from '../../hooks/useMergedRef.js';
import { useStableCallback } from '../../hooks.js';

export interface InfiniteLoadTriggerProps {
	className?: string;
	children?: ReactNode;
	onVisible?: () => void;
}

export const InfiniteLoadTrigger = forwardRef<
	HTMLDivElement,
	InfiniteLoadTriggerProps
>(function InfiniteLoadTrigger({ className, onVisible, ...rest }, ref) {
	const innerRef = useRef<HTMLDivElement>(null);

	const stableOnVisible = useStableCallback(onVisible);
	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				stableOnVisible();
			}
		});
		observer.observe(innerRef.current!);
		return () => {
			observer.disconnect();
		};
	}, [stableOnVisible]);

	return (
		<div
			ref={useMergedRef(ref, innerRef)}
			className={classNames('flex flex-col items-center', className)}
			{...rest}
		/>
	);
});
