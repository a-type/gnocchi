import { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { styled } from 'stitches.config';
import { useDroppable, useDndMonitor } from '@dnd-kit/core';
import { GroceryDnDDrop } from './dndTypes';
import { Formik } from 'formik';
import {
	Box,
	Form,
	SubmitButton,
	TextField,
	Button,
} from 'components/primitives';
import { groceriesState, newCategoryFlipData } from './state';
import useMergedRef from '@react-hook/merged-ref';
import { ArchiveIcon } from '@radix-ui/react-icons';
import { useSnapshot } from 'valtio';
import { groceriesStore } from 'lib/stores/groceries';

export interface DeleteItemFloaterProps {
	className?: string;
}

export const DeleteItemFloater = forwardRef<
	HTMLDivElement,
	DeleteItemFloaterProps
>(function DeleteItemFloater({ ...rest }, ref) {
	const [state, setState] = useState<
		'hidden' | 'visible' | 'over' | 'entering'
	>('hidden');
	const { isOver, setNodeRef } = useDroppable({
		id: '@@delete',
		data: {
			type: 'delete',
		},
	});

	useDndMonitor({
		onDragStart: () => {
			setState('visible');
		},
		onDragEnd: () => {
			setState('hidden');
		},
		onDragOver: ({ over }) => {
			if (over?.data.current?.type === 'delete') {
				setState('over');
			} else {
				setState('visible');
			}
		},
	});

	return (
		<FloatingZone ref={setNodeRef} state={state} {...rest}>
			<Box
				direction="row"
				align="center"
				justify="center"
				gap={3}
				css={{
					fontWeight: 'bold',
					fontSize: '$md',
				}}
			>
				<ArchiveIcon width={30} height={30} /> Delete
			</Box>
		</FloatingZone>
	);
});

const FloatingZone = styled('div', {
	position: 'fixed',
	bottom: '-$3',
	left: '50%',
	transform: 'translateX(-50%)',
	backgroundColor: '$tomato',
	color: '$white',
	boxShadow: '$lg',
	borderRadius: '$xl',
	p: '$3',
	justifyContent: 'center',
	display: 'flex',
	flexDirection: 'row',
	zIndex: 999,

	transition: '0.2s ease all',

	variants: {
		state: {
			hidden: {
				opacity: 0,
				pointerEvents: 'none',
				transition: 'none',
			},
			visible: {
				opacity: 1,
				pointerEvents: 'initial',
				minWidth: '200px',
				width: '30vw',
				transition: '0.2s ease all',
			},
			over: {
				backgroundColor: '$tomatoDark',
				width: '95vw',
				p: '$5',
				transition: '0.2s ease all',
				bottom: '$2',
			},
			entering: {
				opacity: 1,
				width: '95vw',
				transition: '0.2s ease all',
			},
		},
	},
});
