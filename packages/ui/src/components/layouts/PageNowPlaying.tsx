'use client';

import {
	createContext,
	HTMLAttributes,
	ReactNode,
	useContext,
	useMemo,
	useState,
} from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';

export const NowPlayingContext = createContext<{
	container: HTMLDivElement | undefined;
	setContainer: (container: HTMLDivElement) => void;
}>({ container: undefined, setContainer: () => {} });

export const NowPlayingProvider = ({ children }: { children: ReactNode }) => {
	const [container, setContainer] = useState<HTMLDivElement>();
	const value = useMemo(() => ({ container, setContainer }), [container]);

	return (
		<NowPlayingContext.Provider value={value}>
			{children}
		</NowPlayingContext.Provider>
	);
};

export function PageNowPlaying({
	className,
	unstyled,
	...props
}: HTMLAttributes<HTMLDivElement> & { unstyled?: boolean }) {
	const { container } = useContext(NowPlayingContext);
	if (container) {
		return createPortal(
			<div
				{...props}
				className={classNames(
					unstyled
						? undefined
						: 'bg-wash p-2px rounded-2xl border-light shadow-md min-w-32px items-center justify-center',
					className,
				)}
			/>,
			container,
		);
	}
	return null;
}
