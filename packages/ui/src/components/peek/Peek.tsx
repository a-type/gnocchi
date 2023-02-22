import {
	ReactNode,
	useEffect,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import classNames from 'classnames';
import * as classes from './Peek.css.js';
import { useSize, useSizeCssVars } from '../../hooks/useSize.js';
import { useToggle } from '../../hooks/useToggle.jsx';
import { debounce } from '@a-type/utils';

export interface PeekProps {
	peekHeight?: number;
	children: ReactNode;
	className?: string;
}

export function Peek({ peekHeight = 120, children, className }: PeekProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isPeekable, setIsPeekable] = useState(false);
	const contentRef = useSize<HTMLDivElement>(
		useMemo(
			() =>
				debounce(({ height }) => {
					setIsPeekable(height > peekHeight);
					if (containerRef.current) {
						containerRef.current.style.setProperty(
							'--collapsible-height',
							`${height}px`,
						);
					}
				}, 300),
			[],
		),
	);

	const [open, toggle] = useToggle(false);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.style.setProperty(
				'--peek-height',
				`${peekHeight}px`,
			);
		}
	}, [peekHeight]);

	const id = useId();

	return (
		<div
			className={classNames(classes.root, className)}
			ref={containerRef}
			data-state={isPeekable ? (open ? 'open' : 'closed') : undefined}
		>
			<div className={classes.content} ref={contentRef} id={id}>
				{children}
			</div>
			{isPeekable && (
				<button
					data-state={open ? 'open' : 'closed'}
					className={classes.trigger}
					onClick={toggle}
					aria-label="Toggle show description"
					aria-expanded={open}
					aria-controls={id}
				/>
			)}
		</div>
	);
}
