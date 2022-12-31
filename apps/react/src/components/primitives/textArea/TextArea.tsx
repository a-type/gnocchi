import { clsx } from 'clsx';
import * as classes from './TextArea.css.js';
import useMergedRef from '@/hooks/useMergedRef.js';
import { forwardRef, HTMLProps, useLayoutEffect, useRef } from 'react';

export interface TextAreaProps
	extends Omit<HTMLProps<HTMLTextAreaElement>, 'ref'> {
	className?: string;
	autoSize?: boolean;
	// if auto-size, pad the height by this many px
	padBottomPixels?: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
	function TextArea(
		{ autoSize, className, rows, padBottomPixels = 0, ...rest },
		ref,
	) {
		const innerRef = useRef<HTMLTextAreaElement>(null);
		const finalRef = useMergedRef(innerRef, ref);

		useLayoutEffect(() => {
			if (!autoSize) return;
			const element = innerRef.current;
			if (element) {
				function refresh() {
					if (element!.value !== '' || padBottomPixels) {
						element!.style.height = 'auto';
						const baseHeight = element!.scrollHeight;
						element!.style.height = baseHeight + padBottomPixels + 'px';
					}
				}
				refresh();

				element.addEventListener('keyup', refresh);
				return () => {
					element.removeEventListener('keyup', refresh);
				};
			}
		}, [autoSize, padBottomPixels]);

		return (
			<textarea
				ref={finalRef}
				className={clsx(
					classes.root({
						resizeable: !autoSize,
					}),
					className,
				)}
				rows={autoSize ? 1 : rows}
				{...rest}
			/>
		);
	},
);
