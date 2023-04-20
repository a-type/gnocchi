import classNames from 'classnames';
import { forwardRef, ButtonHTMLAttributes } from 'react';
import * as classes from './Button.css.js';
import { Spinner } from '../spinner.js';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	color?:
		| 'primary'
		| 'default'
		| 'ghost'
		| 'destructive'
		| 'ghostDestructive'
		| 'accent';
	size?: 'default' | 'small' | 'icon';
	toggled?: boolean;
	align?: 'start' | 'stretch' | 'end';
	visuallyDisabled?: boolean;
	loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	function Button(
		{
			className,
			color,
			size,
			toggled,
			align,
			visuallyDisabled,
			loading,
			children,
			disabled,
			...props
		},
		ref,
	) {
		return (
			<button
				ref={ref}
				{...props}
				disabled={disabled || loading}
				data-disabled={visuallyDisabled}
				className={classNames(
					classes.root({ color, size, toggled, align }),
					className,
				)}
			>
				{loading && <Spinner size={16} className={classes.spinner} />}
				{children}
			</button>
		);
	},
);
