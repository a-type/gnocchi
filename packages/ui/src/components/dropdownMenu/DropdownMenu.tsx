'use client';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { withClassName } from '../../hooks/withClassName.js';
import classNames from 'classnames';

const StyledContent = withClassName(
	DropdownMenuPrimitive.Content,
	'min-w-220px bg-white z-menu shadow-lg rounded-xl border-default',
	'layer-components:transform-origin-[var(--radix-dropdown-menu-transform-origin)]',
	'layer-components:[&[data-state=open]]:animate-popover-in',
	'layer-components:[&[data-state=closed]]:animate-popover-out',
	'layer-components:(max-h-[var(--radix-dropdown-menu-content-available-height)])',
	'important:motion-reduce:animate-none',
	'will-change-transform',
);
const itemClassName = classNames(
	'text-md leading-4 color-black rounded-sm flex items-center pr-4 pl-8 py-3 relative text-left select-none cursor-pointer',
	'[&[data-disabled]]:(color-gray9 pointer-events-none)',
	'focus-visible:(bg-gray2 color-gray9)',
	'focus:outline-none',
);
const StyledItem = withClassName(DropdownMenuPrimitive.Item, itemClassName);
const StyledCheckboxItem = withClassName(
	DropdownMenuPrimitive.CheckboxItem,
	itemClassName,
);
const StyledRadioItem = withClassName(
	DropdownMenuPrimitive.RadioItem,
	itemClassName,
);

const StyledLabel = withClassName(
	DropdownMenuPrimitive.Label,
	'pl-25px text-12px leading-6 color-gray7',
);

const StyledSeparator = withClassName(
	DropdownMenuPrimitive.Separator,
	'h-1px bg-gray5 m-5px',
);

const StyledItemIndicator = withClassName(
	DropdownMenuPrimitive.ItemIndicator,
	'absolute left-0 w-25px inline-flex items-center justify-center',
);

const StyledArrow = withClassName(
	DropdownMenuPrimitive.Arrow,
	'fill-white stroke-black stroke-1',
);

const StyledTrigger = withClassName(
	DropdownMenuPrimitive.Trigger,
	'select-none',
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
			<StyledContent {...props}>
				<div className="overflow-hidden rounded-xl">{children}</div>
				<StyledArrow />
			</StyledContent>
		</StyledPortal>
	);
};

export const DropdownMenuItemRightSlot = withClassName('div', 'ml-auto');
