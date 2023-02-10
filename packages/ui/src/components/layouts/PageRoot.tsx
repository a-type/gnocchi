import classNames from 'classnames';
import { forwardRef, ReactNode } from 'react';
import * as classes from './PageRoot.css.js';

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
				classes.pageRoot,
				{
					[classes.pageRootLemon]: props.color === 'lemon',
				},
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
});
