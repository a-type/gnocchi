'use client';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { withClassName } from '../../styles/withClassName.js';
import * as classes from './DropdownMenu.css.js';

const StyledContent = withClassName(
	DropdownMenuPrimitive.Content,
	classes.content,
);
const StyledItem = withClassName(DropdownMenuPrimitive.Item, classes.item);
const StyledCheckboxItem = withClassName(
	DropdownMenuPrimitive.CheckboxItem,
	classes.item,
);
const StyledRadioItem = withClassName(
	DropdownMenuPrimitive.RadioItem,
	classes.item,
);

const StyledLabel = withClassName(DropdownMenuPrimitive.Label, classes.label);

const StyledSeparator = withClassName(
	DropdownMenuPrimitive.Separator,
	classes.separator,
);

const StyledItemIndicator = withClassName(
	DropdownMenuPrimitive.ItemIndicator,
	classes.itemIndicator,
);

const StyledArrow = withClassName(DropdownMenuPrimitive.Arrow, classes.arrow);

const StyledTrigger = withClassName(
	DropdownMenuPrimitive.Trigger,
	classes.trigger,
);

const StyledPortal = DropdownMenuPrimitive.Portal;

// Exports
export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = StyledTrigger;
export const DropdownMenuItem = StyledItem;
export const DropdownMenuCheckboxItem = StyledCheckboxItem;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
export const DropdownMenuRadioItem = StyledRadioItem;
export const DropdownMenuItemIndicator = StyledItemIndicator;
export const DropdownMenuLabel = StyledLabel;
export const DropdownMenuSeparator = StyledSeparator;
export const DropdownMenuArrow = StyledArrow;

export const DropdownMenuContent = ({
	children,
	forceMount,
	...props
}: DropdownMenuPrimitive.DropdownMenuContentProps & {
	forceMount?: boolean;
}) => {
	return (
		<StyledPortal forceMount={forceMount}>
			<StyledContent {...props}>{children}</StyledContent>
		</StyledPortal>
	);
};

export const DropdownMenuItemRightSlot = withClassName(
	'div',
	classes.rightSlot,
);
