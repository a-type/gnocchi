'use client';

import classNames from 'classnames';
import { HTMLAttributes } from 'react';

export function PageNav({
	className,
	children,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			{...props}
			className={classNames(
				'[grid-area:nav] relative z-nav',
				'sm:([grid-area:nav] sticky top-0 h-auto bottom-auto left-auto right-auto)',
				className,
			)}
		>
			{children}
		</div>
	);
}
