import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from '@radix-ui/react-icons';
import * as SelectPrimitive from '@radix-ui/react-select';
import { forwardRef } from 'react';
import { clsx } from 'clsx';
import * as classes from './Select.css.js';
import { withClassName } from '@/hocs/withClassName.jsx';

export const SelectItem = forwardRef<
	HTMLDivElement,
	SelectPrimitive.SelectItemProps
>(({ children, className, ...props }, forwardedRef) => {
	return (
		<SelectPrimitive.Item
			className={clsx(classes.item, className)}
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

export const Select = SelectPrimitive.Root;
export const SelectTrigger = withClassName(
	SelectPrimitive.Trigger,
	classes.trigger,
);
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
			className={clsx(classes.icon, className)}
			{...props}
			ref={forwardedRef}
		>
			<ChevronDownIcon />
		</SelectPrimitive.Icon>
	);
});

export const SelectContent = forwardRef<
	HTMLDivElement,
	SelectPrimitive.SelectContentProps
>(({ children, className, ...props }, forwardedRef) => {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				className={clsx(classes.content, className)}
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