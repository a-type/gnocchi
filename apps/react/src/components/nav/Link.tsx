import { ButtonProps, buttonClassNames } from '@aglio/ui/components/button';
import classNames from 'classnames';
import { forwardRef } from 'react';
import { Link, LinkProps } from '@lo-fi/react-router';
import * as classes from './Link.css.js';

export { Link };
export type { LinkProps };

export interface LinkButtonProps extends LinkProps {
	color?: ButtonProps['color'];
	size?: ButtonProps['size'];
	align?: ButtonProps['align'];
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
	function LinkButton({ className, color, size, align, ...props }, ref) {
		return (
			<Link
				className={classNames(
					buttonClassNames.root({
						color,
						size,
						align,
					}),
					classes.root,
					className,
				)}
				{...props}
				ref={ref}
			/>
		);
	},
);
