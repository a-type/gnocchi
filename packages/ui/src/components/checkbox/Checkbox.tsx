import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { ComponentProps, forwardRef } from 'react';
import { CheckIcon } from '@radix-ui/react-icons';
import { clsx } from 'clsx';
import * as classes from './Checkbox.css.js';
import { withClassName } from '../../withClassName.jsx';

const CheckboxRoot = withClassName(CheckboxPrimitive.Root, classes.root);

export function CheckboxIndicator({
	children,
	className,
	...props
}: CheckboxPrimitive.CheckboxIndicatorProps) {
	return (
		<CheckboxPrimitive.Indicator
			className={clsx(classes.indicator, className)}
			{...props}
		>
			{children ?? <CheckIcon width={18} height={18} />}
		</CheckboxPrimitive.Indicator>
	);
}

export const Checkbox = forwardRef<
	HTMLButtonElement,
	ComponentProps<typeof CheckboxRoot>
>(function Checkbox(props, ref) {
	return (
		<CheckboxRoot ref={ref} {...props}>
			<CheckboxIndicator />
		</CheckboxRoot>
	);
});
