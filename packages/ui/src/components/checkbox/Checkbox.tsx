'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { ComponentProps, forwardRef } from 'react';
import { CheckIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import { withClassName } from '../../hooks/withClassName.js';

export const CheckboxRoot = withClassName(
	CheckboxPrimitive.Root,
	classNames(
		'layer-components:(w-28px h-28px flex-shrink-0 relative bg-white border-default transition rounded-[6px])',
		'layer-components:focus-visible:(outline-off) focus-visible:shadow-focus',
		'layer-components:[&[data-state=checked]]:(bg-primary-light border-primary-dark)',
		'layer-components:[&:hover:not(:disabled)]:shadow-[0_0_0_1px_var(--color-black)]',
	),
);

export function CheckboxIndicator({
	children,
	className,
	...props
}: CheckboxPrimitive.CheckboxIndicatorProps) {
	return (
		<CheckboxPrimitive.Indicator
			className={classNames(
				'absolute center translate-[-50%] color-black',
				className,
			)}
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
