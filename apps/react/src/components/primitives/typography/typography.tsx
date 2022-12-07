import { withClassName } from '@/hocs/withClassName.jsx';
import { clsx } from 'clsx';
import { forwardRef, HTMLProps } from 'react';
import * as classes from './typography.css.js';

export const H1 = withClassName('h1', classes.heading);
export const H2 = withClassName('h2', classes.heading);
export const H3 = withClassName('h3', classes.heading);
export const H4 = withClassName('h4', classes.heading);
export const H5 = withClassName('h5', classes.heading);

export const Span = forwardRef<
	HTMLSpanElement,
	HTMLProps<HTMLSpanElement> & {
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
	HTMLProps<HTMLParagraphElement> & {
		size?: 'xs' | 'sm' | 'default';
	}
>(function P({ size = 'default' as const, className, ...props }, ref) {
	return (
		<p
			{...props}
			className={clsx(classes.paragraph({ size }), className)}
			ref={ref}
		/>
	);
});
