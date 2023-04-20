'use client';

import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from '@radix-ui/react-icons';
import * as SelectPrimitive from '@radix-ui/react-select';
import { forwardRef } from 'react';
import classNames from 'classnames';
import * as classes from './Select.css.js';
import { withClassName } from '../../styles/withClassName.js';

export const SelectItem = forwardRef<
	HTMLDivElement,
	SelectPrimitive.SelectItemProps
>(({ children, className, ...props }, forwardedRef) => {
	return (
		<SelectPrimitive.Item
			className={classNames(classes.item, className)}
			{...props}
			ref={forwardedRef}
		>
			<SelectPrimitive.ItemText className={classes.itemText}>
				{children}
			</SelectPrimitive.ItemText>
			<SelectPrimitive.ItemIndicator className={classes.itemIndicator}>
				<CheckIcon />
			</SelectPrimitive.ItemIndicator>
		</SelectPrimitive.Item>
	);
});

export const SelectItemRoot = withClassName(SelectPrimitive.Item, classes.item);
export const SelectItemIndicatorRoot = withClassName(
	SelectPrimitive.ItemIndicator,
	classes.itemIndicator,
);
export const SelectItemIndicator = (
	props: SelectPrimitive.SelectItemIndicatorProps,
) => (
	<SelectItemIndicatorRoot {...props}>
		<CheckIcon />
	</SelectItemIndicatorRoot>
);
export const SelectItemText = withClassName(
	SelectPrimitive.ItemText,
	classes.itemText,
);
export const SelectGroup = SelectPrimitive.Group;

export const Select = SelectPrimitive.Root;
export type SelectProps = SelectPrimitive.SelectProps;
export const SelectTrigger = withClassName(
	SelectPrimitive.Trigger,
	classes.trigger,
);
export const UnstyledSelectTrigger = SelectPrimitive.Trigger;
export const SelectValue = withClassName(SelectPrimitive.Value, classes.value);
export const SelectLabel = withClassName(SelectPrimitive.Label, classes.label);
export const SelectSeparator = withClassName(
	SelectPrimitive.Separator,
	classes.separator,
);
export const SelectIcon = forwardRef<
	HTMLDivElement,
	SelectPrimitive.SelectIconProps
>(({ className, ...props }, forwardedRef) => {
	return (
		<SelectPrimitive.Icon
			className={classNames(classes.icon, className)}
			{...props}
			ref={forwardedRef}
		>
			<ChevronDownIcon />
		</SelectPrimitive.Icon>
	);
});

export const SelectContent = forwardRef<
	HTMLDivElement,
	SelectPrimitive.SelectContentProps & { inDialog?: boolean }
>(({ children, inDialog, className, ...props }, forwardedRef) => {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				className={classNames(
					classes.content,
					inDialog && classes.contentInDialog,
					className,
				)}
				{...props}
				ref={forwardedRef}
			>
				<SelectPrimitive.ScrollUpButton className={classes.scrollButton}>
					<ChevronUpIcon />
				</SelectPrimitive.ScrollUpButton>
				<SelectPrimitive.Viewport className={classes.viewport}>
					{children}
				</SelectPrimitive.Viewport>
				<SelectPrimitive.ScrollDownButton className={classes.scrollButton}>
					<ChevronDownIcon />
				</SelectPrimitive.ScrollDownButton>
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	);
});
