'use client';

import classNames from 'classnames';
import { HTMLAttributes } from 'react';

export function PageNowPlaying({
	className,
	unstyled,
	...props
}: HTMLAttributes<HTMLDivElement> & { unstyled?: boolean }) {
	return (
		<div
			{...props}
			className={classNames(
				'fixed bottom-[var(--now-playing-bottom,60px)] left-0 right-0 z-now-playing flex flex-col gap-2 items-end',
				'sm:(fixed bottom-3 left-[var(--content-left,20%)] transition-opacity top-auto items-end w-[var(--content-width,100%)] max-w-80vw p-0 opacity-[var(--content-ready,0)])',
				unstyled
					? 'p-2'
					: 'layer-components:(bg-wash p-2px rounded-xl border-light shadow-md min-w-32px items-center justify-center m-2 w-auto)',
				className,
			)}
		/>
	);
}
