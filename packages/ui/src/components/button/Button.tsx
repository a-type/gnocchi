import { clsx } from 'clsx';
import { forwardRef, ButtonHTMLAttributes } from 'react';
import * as classes from './Button.css.js';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	color?:
		| 'primary'
		| 'default'
		| 'ghost'
		| 'destructive'
		| 'ghostDestructive'
		| 'accent';
	size?: 'default' | 'small';
	toggled?: boolean;
	align?: 'start' | 'stretch' | 'end';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	function Button({ className, color, size, toggled, align, ...props }, ref) {
		return (
			<button
				ref={ref}
				{...props}
				className={clsx(
					classes.root({ color, size, toggled, align }),
					className,
				)}
			/>
		);
	},
);
