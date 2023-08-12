'use client';

import classNames from 'classnames';
import useMergedRef from '../../hooks/useMergedRef.js';
import { forwardRef, HTMLProps, useLayoutEffect, useRef } from 'react';
import { inputClassName } from '../input.js';

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
			let valueWasEmpty = false;
			if (element) {
				if (
					element!.value !== '' ||
					(!valueWasEmpty && element!.value === '') ||
					padBottomPixels
				) {
					element!.style.height = 'auto';
					const baseHeight = element!.scrollHeight;
					element!.style.height = baseHeight + padBottomPixels + 'px';
				}
				valueWasEmpty = element!.value === '';
			}
		}, [autoSize, padBottomPixels, rest.value]);

		return (
			<textarea
				ref={finalRef}
				className={classNames(
					inputClassName,
					'layer-components:([font-family:inherit] text-inherit overflow-hidden)',
					'layer-variants:rounded-lg',
					{
						'layer-components:[resize:vertical]': !autoSize,
					},
					className,
				)}
				rows={autoSize ? 1 : rows}
				{...rest}
			/>
		);
	},
);
