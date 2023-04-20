import { withClassName } from '../../styles/withClassName.js';
import classNames from 'classnames';
import { forwardRef, HTMLProps } from 'react';
import * as classes from './typography.css.js';

export const H1 = withClassName('h1', classes.heading);
export const H2 = withClassName('h2', classes.heading);
export const H3 = withClassName('h3', classes.heading);
export const H4 = withClassName('h4', classes.heading);
export const H5 = withClassName('h5', classes.heading);

export const Span = withClassName('span', classes.span);

export const P = forwardRef<
	HTMLParagraphElement,
	Omit<HTMLProps<HTMLParagraphElement>, 'size'> & {
		size?: 'xs' | 'sm' | 'default' | 'inherit';
		gutterBottom?: boolean;
	}
>(function P(
	{ size = 'default' as const, gutterBottom = true, className, ...props },
	ref,
) {
	return (
		<p
			{...props}
			className={classNames(
				classes.paragraph({ size, gutterBottom }),
				className,
			)}
			ref={ref}
		/>
	);
});
