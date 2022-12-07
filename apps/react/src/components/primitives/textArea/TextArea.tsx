import { clsx } from 'clsx';
import * as classes from './TextArea.css.js';
import useMergedRef from '@/hooks/useMergedRef.js';
import { forwardRef, HTMLProps, useLayoutEffect, useRef } from 'react';

export interface TextAreaProps
	extends Omit<HTMLProps<HTMLTextAreaElement>, 'ref'> {
	className?: string;
	autoSize?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
	function TextArea({ autoSize, className, rows, ...rest }, ref) {
		const innerRef = useRef<HTMLTextAreaElement>(null);
		const finalRef = useMergedRef(innerRef, ref);

		useLayoutEffect(() => {
			if (!autoSize) return;
			const element = innerRef.current;
			if (element) {
				function refresh() {
					element!.style.height = 'auto';
					if (element!.value !== '') {
						element!.style.height = element!.scrollHeight + 'px';
					}
				}
				refresh();

				element.addEventListener('keyup', refresh);
				return () => {
					element.removeEventListener('keyup', refresh);
				};
			}
		}, [autoSize]);

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
