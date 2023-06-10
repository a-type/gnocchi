'use client';

import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from '@radix-ui/react-icons';
import * as SelectPrimitive from '@radix-ui/react-select';
import { forwardRef } from 'react';
import classNames from 'classnames';
import { withClassName } from '../../hooks/withClassName.js';

export const SelectItem = forwardRef<
	HTMLDivElement,
	SelectPrimitive.SelectItemProps
>(({ children, className, ...props }, forwardedRef) => {
	return (
		<SelectItemRoot className={className} {...props} ref={forwardedRef}>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
			<SelectItemIndicator />
		</SelectItemRoot>
	);
});

export const SelectItemRoot = withClassName(
	SelectPrimitive.Item,
	'text-md leading-4 color-black rounded-sm flex items-center flex-row h-36px pr-4 pl-35px relative select-none',
	'[&[data-disabled]]:(color-gray5 pointer-events-none) [&[data-highlighted]]:(outline-none bg-primary-wash color-black)',
);
export const SelectItemIndicatorRoot = withClassName(
	SelectPrimitive.ItemIndicator,
	'absolute left-0 w-25px inline-flex items-center justify-center',
);
export const SelectItemIndicator = (
	props: SelectPrimitive.SelectItemIndicatorProps,
) => (
	<SelectItemIndicatorRoot {...props}>
		<CheckIcon />
	</SelectItemIndicatorRoot>
);
export const SelectItemText = withClassName(SelectPrimitive.ItemText, '');
export const SelectGroup = SelectPrimitive.Group;

export const Select = SelectPrimitive.Root;
export type SelectProps = SelectPrimitive.SelectProps;
export const SelectTrigger = withClassName(
	SelectPrimitive.Trigger,
	'[all:unset] inline-flex items-center justify-center rounded-md px-2 py-1 text-sm gap-1 color-black border-solid border border-gray5 hover:border-gray7 focus:shadow-focus [&[data-placeholder]]:color-gray8',
);
export const UnstyledSelectTrigger = SelectPrimitive.Trigger;
export const SelectValue = withClassName(
	SelectPrimitive.Value,
	'flex flex-row',
);
export const SelectLabel = withClassName(
	SelectPrimitive.Label,
	'px-25px text-xs leading-6 color-black',
);
export const SelectSeparator = withClassName(
	SelectPrimitive.Separator,
	'h-1px bg-gray50 m-1',
);
export const SelectIcon = forwardRef<
	HTMLDivElement,
	SelectPrimitive.SelectIconProps
>(({ className, ...props }, forwardedRef) => {
	return (
		<SelectPrimitive.Icon
			className={classNames('color-inherit', className)}
			{...props}
			ref={forwardedRef}
		>
			<ChevronDownIcon />
		</SelectPrimitive.Icon>
	);
});

const zIndex = { zIndex: 1001 };
export const SelectContent = forwardRef<
	HTMLDivElement,
	SelectPrimitive.SelectContentProps & { inDialog?: boolean }
>(({ children, inDialog, className, ...props }, forwardedRef) => {
	const commonContent = (
		<>
			<SelectPrimitive.ScrollUpButton className="flex items-center justify-center h-25px bg-white color-primary-dark cursor-default">
				<ChevronUpIcon />
			</SelectPrimitive.ScrollUpButton>
			<SelectPrimitive.Viewport className="p-1">
				{children}
			</SelectPrimitive.Viewport>
			<SelectPrimitive.ScrollDownButton className="flex items-center justify-center h-25px bg-white color-primary-dark cursor-default">
				<ChevronDownIcon />
			</SelectPrimitive.ScrollDownButton>
		</>
	);
	if (inDialog) {
		return (
			<SelectPrimitive.Content
				className={classNames(
					'overflow-hidden bg-white rounded-md z-menu shadow-lg',
					className,
				)}
				ref={forwardedRef}
				{...props}
			>
				{commonContent}
			</SelectPrimitive.Content>
		);
	}

	return (
		<SelectPrimitive.Portal className={className} style={zIndex}>
			<SelectPrimitive.Content
				className={classNames(
					'overflow-hidden bg-white rounded-md z-menu shadow-lg',
					inDialog && 'z-[calc(var(--z-dialog)+1)]',
				)}
				{...props}
				ref={forwardedRef}
			>
				{commonContent}
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	);
});
