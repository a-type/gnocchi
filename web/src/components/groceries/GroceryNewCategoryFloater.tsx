import React, {
	forwardRef,
	useState,
	useRef,
	useEffect,
	useCallback,
} from 'react';
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
import { commit, UpdateType } from '@aphro/runtime-ts';
import GroceryItemMutations from 'stores/groceries/.generated/GroceryItemMutations';
import GroceryCategoryMutations from 'stores/groceries/.generated/GroceryCategoryMutations';
import { useGroceryListCtx } from 'contexts/GroceryListContext';
import { unwraps, useQuery } from '@aphro/react';
import GroceryCategory from 'stores/groceries/.generated/GroceryCategory';
import { setItemCategory } from 'stores/groceries/mutations';

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
	const ctx = useGroceryListCtx();
	const [categories] = unwraps(
		useQuery(
			UpdateType.CREATE_OR_DELETE,
			() => GroceryCategory.queryAll(ctx),
			[],
		),
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
		onDragOver: ({ over }) => {
			if (over?.data.current?.type === 'new') {
				setState('over');
			} else {
				setState('visible');
			}
		},
	});

	const zoneRef = useRef<HTMLDivElement>(null);

	const handleNewCreate = useCallback(
		async (category: GroceryCategory) => {
			setState('hidden');

			if (groceriesState.newCategoryPendingItem) {
				const item = groceriesState.newCategoryPendingItem;
				await setItemCategory(ctx, item, category.id);
				groceriesState.newCategoryPendingItem = null;
			}

			if (zoneRef.current) {
				const zoneBox = zoneRef.current.getBoundingClientRect();
				newCategoryFlipData.current = {
					left: zoneBox.left,
					top: zoneBox.top,
					width: zoneBox.width,
					height: zoneBox.height,
				};
			}
			groceriesState.justCreatedCategoryId = category.id;
		},
		[ctx],
	);

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
				top: '$2',
			},
		},
	},
});

function NewCategoryForm({
	onDone,
}: {
	onDone: (category: GroceryCategory) => void;
}) {
	const ctx = useGroceryListCtx();
	// const emptyCategories = unwraps(useQuery(
	// 	UpdateType.ANY,
	// 	() => GroceryCategory.queryAll(categories[0].ctx).where(
	// 		t => t.queryItems().count() === 0
	// 	),
	// 	[]
	// ))

	// const unusedCategories = categories.filter((category) => {
	// 	return !snap.items.some((item) => item.category === category);
	// });

	const unusedCategories: GroceryCategory[] = [];

	return (
		<Box direction="column" gap={2} align="stretch" w="full">
			<Formik
				initialValues={{ name: '' }}
				onSubmit={({ name }) => {
					// create the category
					const [_, category] = GroceryCategoryMutations.create(ctx, {
						name,
					}).save();
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
			{!!unusedCategories.length && (
				<Box flex={1} align="stretch" gap={2}>
					{unusedCategories.map((category) => (
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
