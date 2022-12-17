import React, { ComponentPropsWithoutRef } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { clsx } from 'clsx';
import * as classes from './Tooltip.css.js';

function Content({
	children,
	className,
	...props
}: TooltipPrimitive.TooltipContentProps) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				className={clsx(classes.content, className)}
				{...props}
			>
				{children}
				<TooltipPrimitive.Arrow className={classes.arrow} />
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	);
}

// Exports
export const Provider = TooltipPrimitive.Provider;

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