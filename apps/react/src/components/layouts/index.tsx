import {
	createContext,
	createRef,
	forwardRef,
	HTMLAttributes,
	ReactNode,
	RefObject,
	useContext,
	useRef,
	useState,
} from 'react';
import { clsx } from 'clsx';
import * as classes from './index.css.js';
import { Box, BoxProps } from '../primitives/index.js';
import { withClassName } from '@/hocs/withClassName.jsx';
import { NavBar } from '../nav/NavBar.jsx';
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
			{nav && <NavBar />}
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
>(function PageRoot({ className, ...props }, ref) {
	const [container, setContainer] = useState<HTMLDivElement>();

	return (
		<NowPlayingContext.Provider value={{ container, setContainer }}>
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
			/>
		</NowPlayingContext.Provider>
	);
});

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

export function PageNav({
	className,
	innerClassName,
	children,
	...props
}: HTMLAttributes<HTMLDivElement> & { innerClassName?: string }) {
	const { setContainer } = useContext(NowPlayingContext);

	return (
		<div {...props} className={clsx(classes.nav, className)}>
			<div className={clsx(classes.navInner, innerClassName)}>{children}</div>
			<div ref={setContainer} className={classes.nowPlayingContainer} />
		</div>
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
