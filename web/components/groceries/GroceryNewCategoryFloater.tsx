import { forwardRef, useState } from 'react';
import { styled } from 'stitches.config';
import { useDroppable, useDndMonitor } from '@dnd-kit/core';
import { GroceryDnDDrop } from './dndTypes';
import { Formik } from 'formik';
import { Box, Form, SubmitButton, TextField } from 'components/primitives';
import { useSnapshot } from 'valtio';
import { groceriesState } from './state';
import { groceriesStore } from 'lib/stores/groceries';

export interface GroceryNewCategoryFloaterProps {
	className?: string;
}

export const GroceryNewCategoryFloater = forwardRef<
	HTMLDivElement,
	GroceryNewCategoryFloaterProps
>(function GroceryNewCategoryFloater({ ...rest }, ref) {
	const [state, setState] = useState<'hidden' | 'visible' | 'entering'>(
		'hidden',
	);
	const { isOver, setNodeRef } = useDroppable({
		id: '@@new',
		data: {
			type: 'new',
		},
	});

	useDndMonitor({
		onDragStart: () => {
			setState('visible');
		},
		onDragEnd: ({ over }) => {
			const drop = over?.data.current as GroceryDnDDrop | undefined;
			if (drop?.type !== 'new') {
				setState('hidden');
			} else {
				setState('entering');
			}
		},
	});

	return (
		<FloatingZone over={isOver} ref={setNodeRef} state={state} {...rest}>
			{isOver ? (
				'New category'
			) : state === 'entering' ? (
				<NewCategoryForm onDone={() => setState('hidden')} />
			) : (
				'New'
			)}
		</FloatingZone>
	);
});

const FloatingZone = styled('div', {
	position: 'fixed',
	top: '0',
	right: '0',
	backgroundColor: '$white',
	boxShadow: '$lg',
	borderRadius: '$xl',
	p: '$4',

	transition: '0.2s ease all',

	variants: {
		state: {
			hidden: {
				opacity: 0,
				pointerEvents: 'none',
			},
			visible: {
				opacity: 1,
				pointerEvents: 'initial',
			},
			entering: {
				opacity: 1,
				left: 0,
			},
		},

		over: {
			true: {
				backgroundColor: '$gray20',
				left: 0,
			},
			false: {},
		},
	},
});

function NewCategoryForm({ onDone }: { onDone: () => void }) {
	return (
		<Formik
			initialValues={{ name: '' }}
			onSubmit={({ name }) => {
				if (groceriesState.newCategoryPendingItem) {
					console.log(
						'Adding new category',
						name,
						'to',
						groceriesState.newCategoryPendingItem,
					);
					groceriesState.newCategoryPendingItem.category = name;
				}
				onDone();
			}}
		>
			<Form>
				<Box direction="row" gap={2}>
					<TextField autoFocus name="name" label="Name" />
					<SubmitButton>Add</SubmitButton>
				</Box>
			</Form>
		</Formik>
	);
}
