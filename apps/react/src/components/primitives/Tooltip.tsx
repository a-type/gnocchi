import React, { ComponentPropsWithoutRef } from 'react';
import { styled, keyframes } from '@stitches/react';
import { violet } from '@radix-ui/colors';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

const slideUpAndFade = keyframes({
	'0%': { opacity: 0, transform: 'translateY(2px)' },
	'100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideRightAndFade = keyframes({
	'0%': { opacity: 0, transform: 'translateX(-2px)' },
	'100%': { opacity: 1, transform: 'translateX(0)' },
});

const slideDownAndFade = keyframes({
	'0%': { opacity: 0, transform: 'translateY(-2px)' },
	'100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideLeftAndFade = keyframes({
	'0%': { opacity: 0, transform: 'translateX(2px)' },
	'100%': { opacity: 1, transform: 'translateX(0)' },
});

const StyledContent = styled(TooltipPrimitive.Content, {
	borderRadius: 4,
	padding: '10px 15px',
	fontSize: 15,
	lineHeight: 1,
	color: violet.violet11,
	backgroundColor: 'white',
	boxShadow:
		'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
	userSelect: 'none',
	'@media (prefers-reduced-motion: no-preference)': {
		animationDuration: '400ms',
		animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
		willChange: 'transform, opacity',
		'&[data-state="delayed-open"]': {
			'&[data-side="top"]': { animationName: slideDownAndFade },
			'&[data-side="right"]': { animationName: slideLeftAndFade },
			'&[data-side="bottom"]': { animationName: slideUpAndFade },
			'&[data-side="left"]': { animationName: slideRightAndFade },
		},
	},
});

const StyledArrow = styled(TooltipPrimitive.Arrow, {
	fill: 'white',
});

function Content({
	children,
	...props
}: ComponentPropsWithoutRef<typeof StyledContent>) {
	return (
		<TooltipPrimitive.Portal>
			<StyledContent {...props}>
				{children}
				<StyledArrow />
			</StyledContent>
		</TooltipPrimitive.Portal>
	);
}

// Exports
export const Provider = TooltipPrimitive.Provider;
export const TooltipRoot = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipContent = Content;

export function Tooltip({
	content,
	children,
	...rest
}: { content: React.ReactNode } & ComponentPropsWithoutRef<
	typeof TooltipTrigger
>) {
	return (
		<TooltipRoot>
			<TooltipTrigger asChild {...rest}>
				{children}
			</TooltipTrigger>
			<TooltipContent sideOffset={5}>{content}</TooltipContent>
		</TooltipRoot>
	);
}
