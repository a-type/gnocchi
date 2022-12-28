import React, { ComponentPropsWithoutRef, ReactNode, useState } from 'react';
import { keyframes, styled } from '@/stitches.config.js';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { BlurLayer } from './BlurLayer.js';

const overlayShow = keyframes({
	'0%': { opacity: 0 },
	'100%': { opacity: 1 },
});

const contentShow = keyframes({
	'0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
	'100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});

const contentShowMobile = keyframes({
	'0%': { opacity: 0, transform: 'translate(0, 2%) scale(.96)' },
	'100%': { opacity: 1, transform: 'translate(0, 0) scale(1)' },
});

const StyledOverlay = styled(DialogPrimitive.Overlay, {
	backgroundColor: '$overlay',
	position: 'fixed',
	inset: 0,
	zIndex: 'calc($dialog - 1)',
	'@media (prefers-reduced-motion: no-preference)': {
		animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
	},
});

const StyledBlurLayer = styled(BlurLayer, {
	$$spread: '60px',

	'@sm': {
		$$spread: '240px',
	},
});

const StyledContent = styled('div', {
	zIndex: '$dialog',
	position: 'fixed',

	'&:focus, &:focus-visible': {
		outline: 'none',
	},

	bottom: 0,
	left: 0,
	right: 0,
	height: 'min-content',
	maxHeight: '85vh',

	transform: 'translate(0, 0, 0)',

	'@sm': {
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: '90vw',
		maxWidth: '450px',
		maxHeight: '85vh',
	},

	variants: {
		width: {
			lg: {
				'@md': {
					maxWidth: '800px',
				},
			},
			md: {
				maxWidth: '600px',
			},
		},
	},
});
const StyledContentContent = styled(DialogPrimitive.Content, {
	backgroundColor: 'white',
	borderTopLeftRadius: '$lg',
	borderTopRightRadius: '$lg',
	zIndex: '$dialog',
	boxShadow:
		'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
	padding: '$6',
	border: '1px solid $black',
	borderBottom: 'none',
	overflowY: 'auto',
	maxHeight: 'inherit',
	position: 'relative',
	display: 'flex',
	flexDirection: 'column',

	'@media (prefers-reduced-motion: no-preference)': {
		animation: `${contentShowMobile} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
	},

	'@sm': {
		borderRadius: '$lg',
		borderBottom: '1px solid $black',
	},

	// '&:focus': { outline: 'none' },
});

function Content({
	children,
	...props
}: ComponentPropsWithoutRef<typeof StyledContentContent>) {
	return (
		<DialogPrimitive.Portal>
			<StyledOverlay />
			<StyledContent>
				<StyledBlurLayer />
				<StyledContentContent {...props}>{children}</StyledContentContent>
			</StyledContent>
		</DialogPrimitive.Portal>
	);
}

const StyledTitle = styled(DialogPrimitive.Title, {
	fontFamily: '$title',
	color: '$black',
	fontSize: '$3xl',
	marginBottom: '$4',
	marginTop: 0,
});

const StyledDescription = styled(DialogPrimitive.Description, {
	margin: '10px 0 20px',
	color: '$gray80',
	fontSize: 15,
	lineHeight: 1.5,
});

// Exports
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogContent = Content;
export const DialogTitle = StyledTitle;
export const DialogDescription = StyledDescription;
export const DialogClose = DialogPrimitive.Close;
