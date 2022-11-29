import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import * as classes from './index.css.js';

export function PageContent({
	children,
	fullHeight,
	noPadding,
	innerProps,
	...rest
}: HTMLAttributes<HTMLDivElement> & {
	fullHeight?: boolean;
	noPadding?: boolean;
	innerProps?: HTMLAttributes<HTMLDivElement>;
}) {
	return (
		<div
			className={clsx(classes.content, {
				[classes.contentNoPadding]: noPadding,
			})}
			{...rest}
		>
			<div
				className={clsx(classes.innerContent, {
					[classes.innerContentFullHeight]: fullHeight,
				})}
				{...innerProps}
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
	}
>(function PageRoot(props, ref) {
	return (
		<div
			ref={ref}
			className={clsx(classes.pageRoot, {
				[classes.pageRootLemon]: props.color === 'lemon',
			})}
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
