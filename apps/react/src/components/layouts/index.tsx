import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import * as classes from './index.css.js';

export function PageContent({
	children,
	fullHeight,
	noPadding,
	innerProps,
	className,
	...rest
}: HTMLAttributes<HTMLDivElement> & {
	fullHeight?: boolean;
	noPadding?: boolean;
	innerProps?: HTMLAttributes<HTMLDivElement>;
}) {
	return (
		<div
			className={clsx(
				classes.content,
				{
					[classes.contentNoPadding]: noPadding,
				},
				className,
			)}
			{...rest}
		>
			<div
				{...innerProps}
				className={clsx(
					classes.innerContent,
					{
						[classes.innerContentFullHeight]: fullHeight,
					},
					innerProps?.className,
				)}
			>
				{children}
			</div>
		</div>
	);
}

export const PageRoot = forwardRef<
	HTMLDivElement,
	{
		color?: 'default' | 'lemon';
		children?: ReactNode;
		className?: string;
	}
>(function PageRoot({ className, ...props }, ref) {
	return (
		<div
			ref={ref}
			className={clsx(
				classes.pageRoot,
				{
					[classes.pageRootLemon]: props.color === 'lemon',
				},
				className,
			)}
			{...props}
		/>
	);
});

export function PageFixedArea({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return <div {...props} className={clsx(classes.fixedArea, className)} />;
}
