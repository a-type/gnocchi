import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import * as classes from './index.css.js';
import { Box, BoxProps } from '../primitives/index.js';

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
	innerProps?: BoxProps;
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
			<Box
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
			</Box>
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

export function PageSection({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return <div {...props} className={clsx(classes.section, className)} />;
}
