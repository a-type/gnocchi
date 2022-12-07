import { forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { clsx } from 'clsx';
import * as classes from './Button.css.js';
import { ButtonProps } from './Button.jsx';

export interface LinkButtonProps extends LinkProps {
	color?: ButtonProps['color'];
	size?: ButtonProps['size'];
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
	function LinkButton({ className, color, size, ...props }, ref) {
		return (
			<Link
				className={clsx(
					classes.root({
						color,
						size,
					}),
					className,
				)}
				{...props}
				ref={ref}
			/>
		);
	},
);
