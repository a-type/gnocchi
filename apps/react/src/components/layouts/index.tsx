import {
	createContext,
	createRef,
	forwardRef,
	HTMLAttributes,
	ReactNode,
	RefObject,
	useContext,
	useMemo,
	useRef,
	useState,
} from 'react';
import { clsx } from 'clsx';
import * as classes from './index.css.js';
import { Box, BoxProps } from '@aglio/ui';
import { withClassName } from '@/hocs/withClassName.jsx';
import { createPortal } from 'react-dom';

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
	innerProps?: BoxProps;
	nav?: boolean;
}) {
	return (
		<div className={clsx(classes.content, className)} {...rest}>
			<Box
				{...innerProps}
				className={clsx(
					classes.innerContent,
					{
						[classes.innerContentFullHeight]: fullHeight,
						[classes.contentNoPadding]: noPadding,
					},
					innerProps?.className,
				)}
			>
				{children}
			</Box>
			<NavOutlet />
		</div>
	);
}

export const PageRoot = forwardRef<
	HTMLDivElement,
	{
		color?: 'default' | 'lemon';
		children?: ReactNode;
		className?: string;
	}
>(function PageRoot({ className, children, ...props }, ref) {
	return (
		<div
			ref={ref}
			className={clsx(
				classes.pageRoot,
				{
					[classes.pageRootLemon]: props.color === 'lemon',
				},
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
});

const NavContext = createContext<{
	container: HTMLDivElement | null;
	setContainer: (container: HTMLDivElement) => void;
}>({ container: null, setContainer: () => {} });

function NavOutlet() {
	const { setContainer } = useContext(NavContext);

	return <div className={classes.nav} ref={setContainer} />;
}

export function PageFixedArea({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return <div {...props} className={clsx(classes.fixedArea, className)} />;
}

export function PageSection({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return <div {...props} className={clsx(classes.section, className)} />;
}

export const PageSectionGrid = withClassName('div', classes.sectionGrid);

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
			<div className={clsx(classes.navInner, innerClassName)}>{children}</div>
			<div ref={setContainer} className={classes.nowPlayingContainer} />
		</>,
		container,
	);
}

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
				className={clsx(unstyled ? undefined : classes.nowPlaying, className)}
			/>,
			container,
		);
	}
	return null;
}

export function NavContextProvider({ children }: { children: ReactNode }) {
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const value = useMemo(() => ({ container, setContainer }), [container]);

	return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}
