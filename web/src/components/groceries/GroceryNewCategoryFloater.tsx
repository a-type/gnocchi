import { useDndMonitor, useDroppable } from '@dnd-kit/core';
import { CardStackPlusIcon } from '@radix-ui/react-icons';
import useMergedRef from '@react-hook/merged-ref';
import {
	Box,
	Button,
	Form,
	SubmitButton,
	TextField,
} from 'components/primitives';
import { Formik } from 'formik';
import React, {
	forwardRef,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { styled } from 'stitches.config';
import { groceries, GroceryCategory } from 'stores/groceries';
import { GroceryDnDDrop } from './dndTypes';
import { groceriesState } from './state';
import { RxDocument } from 'rxdb';

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
	const { setNodeRef } = useDroppable({
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

	const handleNewCreate = useCallback(async (category: GroceryCategory) => {
		if (groceriesState.newCategoryPendingItem) {
			const item = groceriesState.newCategoryPendingItem;
			await groceries.setItemCategory(item, category.id);
			groceriesState.newCategoryPendingItem = null;
		}

		groceriesState.justCreatedCategoryId = category.id;

		setState('hidden');
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
	top: '-$3',
	left: '50%',
	transform: 'translateX(-50%)',
	backgroundColor: '$lemon',
	boxShadow: '$lg',
	borderRadius: '$xl',
	p: '$3',
	justifyContent: 'center',
	display: 'flex',
	flexDirection: 'row',
	zIndex: 100,

	transition: '0.2s ease all',

	variants: {
		state: {
			hidden: {
				opacity: 0,
				pointerEvents: 'none',
				minWidth: '280px',
				width: '30vw',
				transition: '0.2s ease all',
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
				top: '$2',
			},
		},
	},
});

function NewCategoryForm({
	onDone,
}: {
	onDone: (category: RxDocument<GroceryCategory>) => void;
}) {
	// TODO: reevaluate UX - this should probably just search all categories
	// by the input value.
	const categories = groceries.useQuery((db) => db.categories.find());

	return (
		<Box direction="column" gap={2} align="stretch" w="full">
			<Formik
				initialValues={{ name: '' }}
				onSubmit={async ({ name }) => {
					// create the category
					const category = await groceries.createCategory(name);
					onDone(category);
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
			{!!categories?.length && (
				<Box flex={1} align="stretch" gap={2}>
					{categories.map((category) => (
						<Button
							color="ghost"
							css={{
								textAlign: 'start',
								justifyContent: 'start',
							}}
							key={category.id}
							onClick={() => onDone(category)}
						>
							{category.name}
						</Button>
					))}
				</Box>
			)}
		</Box>
	);
}
