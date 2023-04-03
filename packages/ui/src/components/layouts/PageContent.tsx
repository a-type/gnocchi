import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import { Box, BoxProps } from '../box.js';
import * as classes from './PageContent.css.js';
import { NavOutlet } from './PageNav.jsx';

export function PageContent({
	children,
	fullHeight,
	noPadding,
	innerProps,
	className,
	nav = true,
	...rest
}: HTMLAttributes<HTMLDivElement> & {
	fullHeight?: boolean;
	noPadding?: boolean;
	innerProps?: BoxProps;
	nav?: boolean;
}) {
	return (
		<div className={classNames(classes.content, className)} {...rest}>
			<Box
				{...innerProps}
				className={classNames(
					classes.innerContent,
					{
						[classes.innerContentFullHeight]: fullHeight,
						[classes.contentNoPadding]: noPadding,
					},
					innerProps?.className,
				)}
			>
				{children}
			</Box>
			<NavOutlet />
		</div>
	);
}
