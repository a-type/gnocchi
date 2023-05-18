import { ButtonProps, buttonClassNames } from '@aglio/ui/components/button';
import classNames from 'classnames';
import { forwardRef } from 'react';
import { Link, LinkProps } from '@verdant-web/react-router';

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
					'[&[data-transitioning=true]]:opacity-70',
					className,
				)}
				{...props}
				ref={ref}
			/>
		);
	},
);

export const TextLink = forwardRef<HTMLAnchorElement, LinkProps>(
	function TextLink({ className, ...props }, ref) {
		return (
			<Link
				{...props}
				className={classNames(
					'[&[data-transitioning=true]]:opacity-70 font-bold cursor-pointer font-inherit text-gray9',
					className,
				)}
				// ref={ref} // FIXME: in lo-fi
			/>
		);
	},
);
