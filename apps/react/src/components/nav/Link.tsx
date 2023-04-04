import { ButtonProps, buttonClassNames } from '@aglio/ui/components/button';
import classNames from 'classnames';
import { forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';

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
					className,
				)}
				{...props}
				ref={ref}
			/>
		);
	},
);
