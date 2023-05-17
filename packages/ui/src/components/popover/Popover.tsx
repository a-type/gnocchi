'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { withClassName } from '../../hooks/withClassName.js';
import classNames from 'classnames';

const StyledContent = withClassName(
	PopoverPrimitive.Content,
	'rounded-xl p-5 min-w-120px bg-white z-menu shadow-lg border-default opacity-0 display-none max-w-90vw',
	'will-change-transform',
	'animate-ease-springy',
	'important:motion-reduce:animate-none',
	'[&[data-state=open][data-side=top]]:animate-fade-in-up',
	'[&[data-state=open][data-side=right]]:animate-fade-in-right',
	'[&[data-state=open][data-side=bottom]]:animate-fade-in-bottom',
	'[&[data-state=open][data-side=left]]:animate-fade-in-left',
	'[&[data-state=closed][data-side=top]]:animate-fade-out-down',
	'[&[data-state=closed][data-side=right]]:animate-fade-out-left',
	'[&[data-state=closed][data-side=bottom]]:animate-fade-out-up',
	'[&[data-state=closed][data-side=left]]:animate-fade-out-right',
	'[&[data-state=open]]:(opacity-100 flex flex-col)',
);

const StyledArrow = withClassName(PopoverPrimitive.Arrow, 'fill-white');

const StyledClose = withClassName(
	PopoverPrimitive.Close,
	'[all:unset] [font-family:inherit] rounded-full h-25px w-25px inline-flex items-center justify-center color-dark-blend absolute top-5px right-5px hover:bg-light-blend focus:shadow-focus',
);

// Exports
export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverArrow = StyledArrow;
export const PopoverClose = StyledClose;
export const PopoverAnchor = PopoverPrimitive.Anchor;

export const PopoverContent = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof StyledContent> & {
		disableBlur?: boolean;
		containerClassName?: string;
		padding?: 'none' | 'default';
		radius?: 'none' | 'default' | 'md';
	}
>(function PopoverContent(
	{
		children,
		forceMount,
		disableBlur,
		containerClassName,
		className,
		radius,
		padding,
		...props
	},
	ref,
) {
	return (
		<PopoverPrimitive.Portal
			forceMount={forceMount}
			className={containerClassName}
		>
			<StyledContent
				{...props}
				forceMount={forceMount}
				ref={ref}
				className={classNames(
					{
						'p-0': padding === 'none',
						'p-5': padding === 'default',
						'rounded-none': radius === 'none',
						'rounded-xl': radius === 'default',
						'rounded-md': radius === 'md',
					},
					className,
				)}
			>
				{children}
			</StyledContent>
		</PopoverPrimitive.Portal>
	);
});
