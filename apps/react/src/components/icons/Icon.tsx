import { forwardRef, HTMLAttributes } from 'react';
import classNames from 'classnames';
import { IconName } from './generated/iconNames.js';

export interface IconProps extends HTMLAttributes<SVGSVGElement> {
	name: IconName;
	size?: number;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
	{ name, size = 15, className, ...rest },
	ref,
) {
	return (
		<svg
			ref={ref}
			className={classNames(
				'flex-shrink-0 layer-components:fill-none',
				className,
			)}
			width={size}
			height={size}
			{...rest}
		>
			<use xlinkHref={`#icon-${name}`} />
		</svg>
	);
});
