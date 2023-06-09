import { ReactNode, Suspense } from 'react';
import classNames from 'classnames';
import { stopPropagation } from '@aglio/tools';

export interface ActionBarProps {
	children: ReactNode;
	className?: string;
	wrap?: boolean;
}

export function ActionBar({
	children,
	className,
	wrap,
	...rest
}: ActionBarProps) {
	return (
		<Suspense fallback={null}>
			<div
				className={classNames(
					'flex flex-row items-center justify-start w-full overflow-hidden relative h-[max-content] transition-[height] springy',
					'[&:empty]:height-0',
					'after:(content-[""] absolute right-0 top-0 bottom-0 w-50px z-1 bg-gradient-to-l from-wash to-transparent] pointer-events-none)',
					className,
				)}
				{...rest}
			>
				<div
					className={classNames(
						'flex flex-row items-center justify-start w-full overflow-y-hidden overflow-x-auto pr-80px relative h-full [&::-webkit-scrollbar]:display-none',
						wrap && 'flex-wrap',
					)}
					// stop scroll pointer events from bubbling up to the parent
					onPointerDown={stopPropagation}
					onPointerMove={stopPropagation}
					onPointerUp={stopPropagation}
				>
					{children}
				</div>
			</div>
		</Suspense>
	);
}
