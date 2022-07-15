import * as PopoverPrimitive from '@radix-ui/react-popover';

import { keyframes, styled } from 'stitches.config';

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
const StyledContent = styled(PopoverPrimitive.Content, {
	borderRadius: '$xl',
	padding: '$5',
	minWidth: 120,
	backgroundColor: 'white',
	boxShadow:
		'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
	'@media (prefers-reduced-motion: no-preference)': {
		animationDuration: '400ms',
		animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
		animationFillMode: 'forwards',
		willChange: 'transform, opacity',
		'&[data-state="open"]': {
			'&[data-side="top"]': { animationName: slideDownAndFade },
			'&[data-side="right"]': { animationName: slideLeftAndFade },
			'&[data-side="bottom"]': { animationName: slideUpAndFade },
			'&[data-side="left"]': { animationName: slideRightAndFade },
		},
	},
	'&:focus': {
		boxShadow: `hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px, 0 0 0 2px $colors$lemon`,
	},
});

const StyledArrow = styled(PopoverPrimitive.Arrow, {
	fill: 'white',
});

const StyledClose = styled(PopoverPrimitive.Close, {
	all: 'unset',
	fontFamily: 'inherit',
	borderRadius: '100%',
	height: 25,
	width: 25,
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	color: '$darkBlend',
	position: 'absolute',
	top: 5,
	right: 5,

	'&:hover': { backgroundColor: '$lightBlend' },
	'&:focus': { boxShadow: `0 0 0 2px $colors$lemon` },
});

// Exports
export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverContent = StyledContent;
export const PopoverArrow = StyledArrow;
export const PopoverClose = StyledClose;
