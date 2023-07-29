import { HTMLAttributes, forwardRef } from 'react';
import { withClassName } from '../../hooks/withClassName.js';
import classNames from 'classnames';

const DividerBase = withClassName('div', 'w-full h-1px bg-black relative');

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
	compensate?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
	padded?: boolean;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
	function Divider({ compensate, padded, className, ...props }, ref) {
		return (
			<DividerBase
				ref={ref}
				style={{
					left: compensate ? `calc(${compensate} * 0.25rem)` : undefined,
					width: compensate ? `calc(100% - ${compensate} * 0.5rem)` : undefined,
				}}
				{...props}
				className={classNames('flex-shrink-0', padded && 'my-4', className)}
			/>
		);
	},
);
