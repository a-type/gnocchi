import { withClassName } from '@/hocs/withClassName.jsx';
import { clsx } from 'clsx';
import { forwardRef, HTMLProps } from 'react';
import * as classes from './typography.css.js';

export const H1 = withClassName('h1', classes.heading, ['gutterBottom']);
export const H2 = withClassName('h2', classes.heading, ['gutterBottom']);
export const H3 = withClassName('h3', classes.heading, ['gutterBottom']);
export const H4 = withClassName('h4', classes.heading, ['gutterBottom']);
export const H5 = withClassName('h5', classes.heading, ['gutterBottom']);

export const Span = forwardRef<
	HTMLSpanElement,
	Omit<HTMLProps<HTMLSpanElement>, 'size'> & {
		size?: 'xs' | 'sm' | 'default';
	}
>(function Span({ size = 'default' as const, className, ...props }, ref) {
	return (
		<span
			{...props}
			className={clsx(classes.span[size], className)}
			ref={ref}
		/>
	);
});

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
			className={clsx(classes.paragraph({ size, gutterBottom }), className)}
			ref={ref}
		/>
	);
});
