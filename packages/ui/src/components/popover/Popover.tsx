'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { withClassName } from '../../hooks/withClassName.js';
import classNames from 'classnames';

const StyledContent = withClassName(
	PopoverPrimitive.Content,
	'layer-components:(rounded-xl min-w-120px bg-white z-menu shadow-lg border-default op-0 display-none max-w-90vw)',
	'will-change-transform',
	'animate-ease-springy animate-duration-200',
	'important:motion-reduce:animate-none',
	'[&[data-state=open][data-side=top]]:animate-name-fade-in-down',
	'[&[data-state=open][data-side=right]]:animate-name-fade-in-left',
	'[&[data-state=open][data-side=bottom]]:animate-name-fade-in-up',
	'[&[data-state=open][data-side=left]]:animate-name-fade-in-right',
	'[&[data-state=closed][data-side=top]]:animate-name-fade-out-up',
	'[&[data-state=closed][data-side=right]]:animate-name-fade-out-right',
	'[&[data-state=closed][data-side=bottom]]:animate-name-fade-out-down',
	'[&[data-state=closed][data-side=left]]:animate-name-fade-out-left',
	'layer-components:[&[data-state=open]]:(opacity-100 flex flex-col)',
);

const StyledArrow = withClassName(
	PopoverPrimitive.Arrow,
	'fill-white stroke-black',
);

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
		radius = 'default',
		padding = 'default',
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
						'layer-variants:important:p-0': padding === 'none',
						'layer-variants:p-5': padding === 'default',
						'layer-variants:rounded-none': radius === 'none',
						'layer-variants:rounded-lg': radius === 'default',
						'layer-variants:rounded-md': radius === 'md',
					},
					className,
				)}
			>
				{children}
			</StyledContent>
		</PopoverPrimitive.Portal>
	);
});
