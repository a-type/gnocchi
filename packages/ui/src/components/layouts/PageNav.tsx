'use client';

import {
	createContext,
	HTMLAttributes,
	memo,
	ReactNode,
	useContext,
	useMemo,
	useState,
} from 'react';
import { createPortal } from 'react-dom';
import { NowPlayingContext } from './PageNowPlayingContext.jsx';
import classNames from 'classnames';

const NavContext = createContext<{
	container: HTMLDivElement | null;
	setContainer: (container: HTMLDivElement) => void;
}>({ container: null, setContainer: () => {} });

export const NavOutlet = memo(function NavOutlet() {
	const { setContainer } = useContext(NavContext);

	return (
		<div
			className={classNames(
				'[grid-area:auto] fixed bottom-0 left-0 right-0 z-nav',
				'sm:([grid-area:nav] sticky top-0 h-auto bottom-auto left-auto right-auto)',
			)}
			ref={setContainer}
		/>
	);
});

export function NavContextProvider({ children }: { children: ReactNode }) {
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const value = useMemo(() => ({ container, setContainer }), [container]);

	return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function PageNav({
	className,
	innerClassName,
	children,
	...props
}: HTMLAttributes<HTMLDivElement> & { innerClassName?: string }) {
	const { container } = useContext(NavContext);
	const { setContainer } = useContext(NowPlayingContext);

	if (!container) return null;

	return createPortal(
		<>
			<div className={innerClassName}>{children}</div>
			<div
				ref={setContainer}
				className="absolute bottom-full w-full flex flex-col gap-2 items-end p-2 sm:(fixed bottom-3 left-50% translate-x--50% top-auto items-end w-full max-w-600px p-0) md:(w-80% max-w-800px)"
			/>
		</>,
		container,
	);
}
