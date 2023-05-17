import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import { NavOutlet } from './PageNav.jsx';

export function PageContent({
	children,
	fullHeight,
	noPadding,
	innerProps,
	className,
	nav = true,
	...rest
}: HTMLAttributes<HTMLDivElement> & {
	fullHeight?: boolean;
	noPadding?: boolean;
	innerProps?: HTMLAttributes<HTMLDivElement>;
	nav?: boolean;
}) {
	return (
		<div
			className={classNames(
				'grid grid-areas-[innerContent] grid-cols[1fr] grid-rows-[1fr] items-start justify-center relative flex-1 gap-3 h-max-content',
				'sm:(grid-areas-[gutter1_nav_innerContent_gutter2] grid-cols-[1fr_auto_min(800px,60vw)_1fr])',
				className,
			)}
			{...rest}
		>
			<div
				{...innerProps}
				className={classNames(
					'w-full min-w-0 flex flex-col mb-120px [grid-area:innerContent] px-4 py-6',
					'sm:(max-w-700px w-full)',
					{
						'flex-1': fullHeight,
						'important:(p-0 sm:p-4)': noPadding,
					},
					innerProps?.className,
				)}
			>
				{children}
			</div>
			<NavOutlet />
		</div>
	);
}
