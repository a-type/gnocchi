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
import { CardStackPlusIcon } from '@radix-ui/react-icons';
import { useSnapshot } from 'valtio';
import { groceriesStore } from 'lib/stores/groceries';

export interface GroceryNewCategoryFloaterProps {
	className?: string;
}

export const GroceryNewCategoryFloater = forwardRef<
	HTMLDivElement,
	GroceryNewCategoryFloaterProps
>(function GroceryNewCategoryFloater({ ...rest }, ref) {
	const [state, setState] = useState<
		'hidden' | 'visible' | 'over' | 'entering'
	>('hidden');
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
		onDragOver: ({ over }) => {
			if (over?.data.current?.type === 'new') {
				setState('over');
			} else {
				setState('visible');
			}
		},
	});

	const zoneRef = useRef<HTMLDivElement>(null);

	const handleNewCreate = useCallback((name: string) => {
		setState('hidden');
		if (groceriesState.newCategoryPendingItem) {
			groceriesState.newCategoryPendingItem.category = name;
			groceriesState.newCategoryPendingItem = null;
		}
		const zoneBox = zoneRef.current.getBoundingClientRect();
		newCategoryFlipData.current = {
			left: zoneBox.left,
			top: zoneBox.top,
			width: zoneBox.width,
			height: zoneBox.height,
		};
		groceriesState.justCreatedCategoryName = name;
	}, []);

	const cancelNewCreate = useCallback(() => {
		setState('hidden');
		groceriesState.newCategoryPendingItem = null;
	}, []);

	const finalRef = useMergedRef(setNodeRef, zoneRef);

	// close entering mode if an outside click is detected
	useEffect(() => {
		if (state === 'entering') {
			const handleClick = (e: MouseEvent) => {
				if (!zoneRef.current?.contains(e.target as Node)) {
					cancelNewCreate();
				}
			};
			document.addEventListener('click', handleClick);
			return () => {
				document.removeEventListener('click', handleClick);
			};
		}
	}, [state, cancelNewCreate]);

	return (
		<FloatingZone ref={finalRef} state={state} {...rest}>
			{state === 'entering' ? (
				<NewCategoryForm onDone={handleNewCreate} />
			) : (
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
					<CardStackPlusIcon width={30} height={30} /> New Category
				</Box>
			)}
		</FloatingZone>
	);
});

const FloatingZone = styled('div', {
	position: 'fixed',
	top: '-$6',
	left: '50%',
	transform: 'translateX(-50%)',
	backgroundColor: '$lemon',
	boxShadow: '$lg',
	borderRadius: '$xl',
	p: '$4',
	justifyContent: 'center',
	display: 'flex',
	flexDirection: 'row',

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
				minWidth: '280px',
				width: '30vw',
				transition: '0.2s ease all',
			},
			over: {
				backgroundColor: '$lemonDark',
				width: '95vw',
				p: '$5',
				transition: '0.2s ease all',
				top: '$2',
			},
			entering: {
				opacity: 1,
				width: '95vw',
				transition: '0.2s ease all',
			},
		},
	},
});

function NewCategoryForm({ onDone }: { onDone: (name: string) => void }) {
	const snap = useSnapshot(groceriesStore);

	const unusedCategories = [...snap.categories].filter((category) => {
		return !snap.items.some((item) => item.category === category);
	});

	return (
		<Box direction="column" gap={2} align="stretch" w="full">
			<Formik
				initialValues={{ name: '' }}
				onSubmit={({ name }) => {
					onDone(name);
				}}
			>
				<Form css={{ width: '100%' }}>
					<Box direction="row" align="end" justify="stretch" w="full" gap={2}>
						<TextField
							placeholder="Dairy & Eggs"
							autoFocusDelay={100}
							name="name"
							css={{ flex: 1 }}
						/>
						<SubmitButton>Add</SubmitButton>
					</Box>
				</Form>
			</Formik>
			{!!unusedCategories.length && (
				<Box flex={1} align="stretch" gap={2}>
					{unusedCategories.map((category) => (
						<Button
							color="ghost"
							css={{
								textAlign: 'start',
								justifyContent: 'start',
							}}
							key={category}
							onClick={() => onDone(category)}
						>
							{category}
						</Button>
					))}
				</Box>
			)}
		</Box>
	);
}
