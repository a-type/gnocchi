import classNames from 'classnames';
import { forwardRef, ReactNode } from 'react';

export const PageRoot = forwardRef<
	HTMLDivElement,
	{
		color?: 'default' | 'lemon';
		children?: ReactNode;
		className?: string;
	}
>(function PageRoot({ className, children, ...props }, ref) {
	return (
		<div
			ref={ref}
			className={classNames(
				'flex-grow-1 flex-shrink-1 flex-basis-0 flex flex-col',
				{
					'bg-[var(--palette-yellow-70)]': props.color === 'lemon',
				},
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
});
