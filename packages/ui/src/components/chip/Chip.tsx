import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';
import { HTMLAttributes, forwardRef } from 'react';

export interface ChipProps extends HTMLAttributes<HTMLElement> {
	color?: 'neutral' | 'primary' | 'accent';
	asChild?: boolean;
}

export const Chip = forwardRef<any, ChipProps>(function Chip(
	{ className, color = 'neutral', asChild, ...rest },
	ref,
) {
	const Component = asChild ? Slot : 'div';
	return (
		<Component
			ref={ref}
			className={classNames(
				'inline-flex flex-row gap-1 items-center whitespace-nowrap border-light border-solid border-1 rounded-full px-2 py-1',
				{
					'bg-primary-wash': color === 'primary',
					'bg-accent-wash': color === 'accent',
				},
				className,
			)}
			{...rest}
		/>
	);
});
