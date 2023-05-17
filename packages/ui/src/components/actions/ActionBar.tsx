import { ReactNode, Suspense } from 'react';
import classNames from 'classnames';

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
					'after:(content-[""] absolute right-0 top-0 bottom-0 w-50 z-1 bg-[linear-gradient(to_left,var(--color-wash)_0%,rgba(255,255,255,0)_100%)] pointer-events-none)',
					className,
				)}
				{...rest}
			>
				<div
					className={classNames(
						'flex flex-row items-center justify-start w-full overflow-y-hidden overflow-x-auto pr-80px relative h-full [&::-webkit-scrollbar]:display-none',
						wrap && 'flex-wrap',
					)}
				>
					{children}
				</div>
			</div>
		</Suspense>
	);
}
