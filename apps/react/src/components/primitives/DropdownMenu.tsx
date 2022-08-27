import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as MenuPrimitive from '@radix-ui/react-menu';
import { keyframes, styled } from 'stitches.config.js';

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

const StyledContent = styled(DropdownMenuPrimitive.Content, {
	minWidth: 220,
	backgroundColor: 'white',
	borderRadius: 6,
	padding: 5,
	boxShadow:
		'0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
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
});

const itemStyles = {
	all: 'unset',
	fontSize: 13,
	lineHeight: 1,
	color: '$black',
	borderRadius: 3,
	display: 'flex',
	alignItems: 'center',
	height: 25,
	padding: '0 5px',
	position: 'relative',
	paddingLeft: 25,
	userSelect: 'none',

	'&[data-disabled]': {
		color: '$gray90',
		pointerEvents: 'none',
	},

	'&:focus': {
		backgroundColor: '$lemon',
		color: '$lemonDarker',
	},
};

const StyledItem = styled(DropdownMenuPrimitive.Item, { ...itemStyles });
const StyledCheckboxItem = styled(DropdownMenuPrimitive.CheckboxItem, {
	...itemStyles,
});
const StyledRadioItem = styled(DropdownMenuPrimitive.RadioItem, {
	...itemStyles,
});
const StyledTriggerItem = styled(DropdownMenuPrimitive.TriggerItem, {
	'&[data-state="open"]': {
		backgroundColor: '$lemon',
		color: '$lemonDarker',
	},
	...itemStyles,
});

const StyledLabel = styled(DropdownMenuPrimitive.Label, {
	paddingLeft: 25,
	fontSize: 12,
	lineHeight: '25px',
	color: '$gray70',
});

const StyledSeparator = styled(DropdownMenuPrimitive.Separator, {
	height: 1,
	backgroundColor: '$gray50',
	margin: 5,
});

const StyledItemIndicator = styled(DropdownMenuPrimitive.ItemIndicator, {
	position: 'absolute',
	left: 0,
	width: 25,
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const StyledArrow = styled(DropdownMenuPrimitive.Arrow, {
	fill: 'white',
});

const StyledTrigger = styled(DropdownMenuPrimitive.Trigger, {
	userSelect: 'none',
});

// Exports
export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = StyledTrigger;
export const DropdownMenuContent = StyledContent;
export const DropdownMenuItem = StyledItem;
export const DropdownMenuCheckboxItem = StyledCheckboxItem;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
export const DropdownMenuRadioItem = StyledRadioItem;
export const DropdownMenuItemIndicator = StyledItemIndicator;
export const DropdownMenuTriggerItem = StyledTriggerItem;
export const DropdownMenuLabel = StyledLabel;
export const DropdownMenuSeparator = StyledSeparator;
export const DropdownMenuArrow = StyledArrow;
export const DropdownMenuAnchor = styled(MenuPrimitive.Anchor, {});
