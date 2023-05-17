import { HTMLAttributes } from 'react';
import classNames from 'classnames';

export function PageFixedArea({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			{...props}
			className={classNames(
				'sticky top-0 z-nav bg-wash w-full items-stretch gap-2 flex flex-col',
				className,
			)}
		/>
	);
}
