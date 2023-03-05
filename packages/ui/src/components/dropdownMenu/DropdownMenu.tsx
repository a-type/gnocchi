'use client';

import React, { useState } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { createPortal } from 'react-dom';
import { BlurLayer } from '../blurLayer/BlurLayer.js';
import { withClassName } from '../../withClassName.jsx';
import * as classes from './DropdownMenu.css.js';

const StyledContent = withClassName(
	DropdownMenuPrimitive.Content,
	classes.content,
);
const StyledItem = withClassName(DropdownMenuPrimitive.Item, classes.item, [
	'color',
]);
const StyledCheckboxItem = withClassName(
	DropdownMenuPrimitive.CheckboxItem,
	classes.item,
	['color'],
);
const StyledRadioItem = withClassName(
	DropdownMenuPrimitive.RadioItem,
	classes.item,
	['color'],
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
	const [contentElement, contentRef] = useState<HTMLDivElement | null>(null);
	return (
		<StyledPortal forceMount={forceMount}>
			<>
				<StyledContent {...props} ref={contentRef}>
					{children}
				</StyledContent>
				{contentElement?.parentElement &&
					createPortal(<BlurLayer />, contentElement.parentElement)}
			</>
		</StyledPortal>
	);
};

export const DropdownMenuItemRightSlot = withClassName(
	'div',
	classes.rightSlot,
);
