import classNames from 'classnames';
import { ComponentProps, ComponentPropsWithRef, forwardRef } from 'react';

export const inputClassName = classNames(
	'layer-components:(px-4 py-2 text-md font-sans rounded-lg bg-gray-blend select-auto min-w-60px color-black border-default)',
	'layer-components:focus:(outline-none bg-gray2)',
	'layer-components:focus-visible:(outline-none shadow-focus)',
	'layer-components:md:(min-w-120px)',
);

export const Input = forwardRef<
	HTMLInputElement,
	ComponentProps<'input'> & {
		variant?: 'default' | 'primary';
	}
>(function Input({ className, variant = 'default', ...props }, ref) {
	return (
		<input
			{...props}
			className={classNames(
				inputClassName,
				{
					'rounded-full': variant === 'primary',
				},
				className,
			)}
			ref={ref}
		/>
	);
});

export type InputProps = ComponentPropsWithRef<'input'>;
