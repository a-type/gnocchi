'use client';

import {
	createContext,
	HTMLAttributes,
	ReactNode,
	useContext,
	useMemo,
	useState,
} from 'react';
import { createPortal } from 'react-dom';
import * as classes from './PageNav.css.js';
import { NowPlayingContext } from './PageNowPlaying.jsx';
import classnames from 'classnames';

const NavContext = createContext<{
	container: HTMLDivElement | null;
	setContainer: (container: HTMLDivElement) => void;
}>({ container: null, setContainer: () => {} });

export function NavOutlet() {
	const { setContainer } = useContext(NavContext);

	return <div className={classes.nav} ref={setContainer} />;
}

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
			<div className={classnames(classes.navInner, innerClassName)}>
				{children}
			</div>
			<div ref={setContainer} className={classes.nowPlayingContainer} />
		</>,
		container,
	);
}
