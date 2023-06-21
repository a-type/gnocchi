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
				'flex-grow-1 flex-shrink-1 flex-basis-0 min-h-0 h-full',
				'grid grid-areas-[content]-[nav] grid-cols-[1fr] grid-rows-[1fr] items-start justify-center',
				'sm:(grid-areas-[gutter1_nav_content_gutter2] grid-cols-[1fr_auto_min(800px,60vw)_1fr] min-h-auto)',
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
