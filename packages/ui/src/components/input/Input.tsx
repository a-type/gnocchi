import classNames from 'classnames';
import { withClassName } from '../../hooks/withClassName.js';
import { ComponentProps, ComponentPropsWithRef, forwardRef } from 'react';

export const inputClassName = classNames(
	'px-3 py-2 text-md font-sans rounded-md bg-gray-blend select-auto min-w-60px color-black border-default',
	'focus:(outline-none bg-gray2)',
	'focus-visible:(outline-none shadow-focus)',
	'md:(min-w-120px)',
);

export const Input = withClassName(
	forwardRef<HTMLInputElement, ComponentProps<'input'>>(function Input(
		props,
		ref,
	) {
		return <input {...props} ref={ref} />;
	}),
	inputClassName,
);

export type InputProps = ComponentPropsWithRef<'input'>;
