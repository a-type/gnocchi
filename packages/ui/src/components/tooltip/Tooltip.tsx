'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import classNames from 'classnames';

function Content({
	children,
	className,
	...props
}: TooltipPrimitive.TooltipContentProps) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				className={classNames(
					'relative rounded-lg py-2 px-3 border-default text-sm leading-tight color-inherit bg-white shadow-sm select-none display-none z-tooltip sm:display-initial',
					'[&[data-state=delayed-open][data-side=top]]:animate-fade-in-up',
					'[&[data-state=delayed-open][data-side=right]]:animate-fade-in-right',
					'[&[data-state=delayed-open][data-side=bottom]]:animate-fade-in-down',
					'[&[data-state=delayed-open][data-side=left]]:animate-fade-in-left',
					className,
				)}
				{...props}
			>
				{children}
				<TooltipPrimitive.Arrow className="fill-white stroke-black stroke-1" />
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	);
}

// Exports
export const TooltipProvider = TooltipPrimitive.Provider;

export function Tooltip({
	content,
	children,
	...rest
}: { content: React.ReactNode } & ComponentPropsWithoutRef<
	typeof TooltipPrimitive.TooltipTrigger
>) {
	return (
		<TooltipPrimitive.Root>
			<TooltipPrimitive.TooltipTrigger asChild {...rest}>
				{children}
			</TooltipPrimitive.TooltipTrigger>
			<Content sideOffset={15}>{content}</Content>
		</TooltipPrimitive.Root>
	);
}
