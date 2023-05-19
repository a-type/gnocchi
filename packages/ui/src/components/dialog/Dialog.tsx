'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
	ComponentPropsWithoutRef,
	forwardRef,
	useCallback,
	useRef,
} from 'react';
import { withClassName } from '../../hooks/withClassName.js';
import useMergedRef from '../../hooks/useMergedRef.js';
import { useParticles } from '../particles.js';
import classNames from 'classnames';

const StyledOverlay = withClassName(
	DialogPrimitive.Overlay,
	'bg-overlay fixed inset-0 z-dialog-backdrop animate-fade-in [&[data-state=closed]]:animate-fade-out animate-duration-200 motion-reduce:animate-none',
);

const StyledContent = withClassName(
	DialogPrimitive.Content,
	'z-dialog fixed bottom-[var(--viewport-bottom-offset,0px)] left-0 right-0 h-min-content max-h-[calc(0.85*var(--viewport-height,100vh))]',
	'translate-0 transform-gpu',
	'animate-ease-out',
	'shadow-xl bg-white rounded-tl-lg rounded-tr-lg p-6 border-default border-b-0 overflow-y-auto flex flex-col pb-[calc(3rem+env(safe-area-inset-bottom,0px))]',
	'animate-fade-in-up-big [&[data-state=closed]]:animate-fade-out-down-big animate-ease-in motion-reduce:animate-none',
	'sm:(animate-duration-200 left-50% top-50% translate-[-50%] w-90vw max-w-450px max-h-85vh pb-6 rounded-lg border-b-1 animate-keyframes-fade-in [&[data-state=closed]]:animate-keyframes-fade-out motion-reduce:animate-none)',
);

export const Content = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof StyledContent> & {
		outerClassName?: string;
		width?: 'lg' | 'md' | 'sm';
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

				const matchesSmall = !window.matchMedia('(min-width:600px)').matches;
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
			} else if (element?.getAttribute('data-state') === 'closed') {
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
				className={classNames(
					{
						'md:max-w-800px': width === 'lg',
						'max-w-600px': width === 'md',
						'max-w-300px': width === 'sm',
					},
					outerClassName || className,
				)}
			>
				{children}
			</StyledContent>
		</DialogPrimitive.Portal>
	);
});

const StyledTitle = withClassName(
	DialogPrimitive.Title,
	'font-title color-black text-3xl mb-4 mt-0',
);

const StyledDescription = withClassName(
	DialogPrimitive.Description,
	'mt-3 mb-6 color-gray8 text-md leading-6',
);

// Exports
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogContent = Content;
export const DialogTitle = StyledTitle;
export const DialogDescription = StyledDescription;
export const DialogClose = DialogPrimitive.Close;

export const DialogActions = withClassName(
	'div',
	'flex justify-end sticky bottom-0 w-full gap-3 items-center bg-white py-3 translate-y-6 flex-wrap',
);
