'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
	ComponentPropsWithoutRef,
	forwardRef,
	useCallback,
	useRef,
} from 'react';
import { withClassName } from '../../styles/withClassName.js';
import * as classes from './Dialog.css.js';
import useMergedRef from '../../hooks/useMergedRef.js';
import { useParticles } from '../particles.js';
import { mediaQueries } from '../../styles.js';

const StyledOverlay = withClassName(DialogPrimitive.Overlay, classes.overlay);

const StyledContent = withClassName(DialogPrimitive.Content, classes.content);

export const Content = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof StyledContent> & {
		outerClassName?: string;
		width?: ComponentPropsWithoutRef<typeof StyledContent>['width'];
	}
>(function Content(
	{ children, width, outerClassName, className, ...props },
	ref,
) {
	const particles = useParticles();
	const wasOpenRef = useRef(false);
	const openRef = useCallback(
		(element: HTMLDivElement | null) => {
			if (
				!wasOpenRef.current &&
				element?.getAttribute('data-state') === 'open'
			) {
				wasOpenRef.current = true;

				const matchesSmall = !window.matchMedia(mediaQueries.md).matches;
				if (!matchesSmall) return;

				setTimeout(() => {
					particles?.addParticles(
						particles.elementExplosion({
							count: 20,
							borders: ['top'],
							color: ['#00000002', '#00000000'],
							element,
							startRadius: 15,
							endRadius: 0,
							lifespan: 1000,
							force: 0.5,
							drag: 0.01,
							forceFuzz: 0.5,
							angleFuzz: 0.1,
						}),
					);
				}, 180);
			} else {
				wasOpenRef.current = false;
			}
		},
		[particles],
	);

	const finalRef = useMergedRef(ref, openRef);

	return (
		<DialogPrimitive.Portal>
			<StyledOverlay />
			<StyledContent
				ref={finalRef}
				{...props}
				width={width}
				className={outerClassName || className}
			>
				{children}
			</StyledContent>
		</DialogPrimitive.Portal>
	);
});

const StyledTitle = withClassName(DialogPrimitive.Title, classes.title);

const StyledDescription = withClassName(
	DialogPrimitive.Description,
	classes.description,
);

// Exports
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogContent = Content;
export const DialogTitle = StyledTitle;
export const DialogDescription = StyledDescription;
export const DialogClose = DialogPrimitive.Close;

export const DialogActions = withClassName('div', classes.actions);
