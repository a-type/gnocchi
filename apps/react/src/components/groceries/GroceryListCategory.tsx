import { useDndMonitor } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React, { memo, useMemo, useState } from 'react';
import { keyframes, styled } from '@/stitches.config.js';
import { useSnapshot } from 'valtio';
import { H2 } from '../primitives/index.js';
import { GroceryDnDDrop } from './dndTypes.js';
import { GroceryListItemDraggable } from './items/GroceryListItem.js';
import { groceriesState } from './state.js';
import { hooks, GroceryCategory } from '@/stores/groceries/index.js';

export function GroceryListCategory({
	category,
	...rest
}: {
	category: GroceryCategory;
}) {
	hooks.useWatch(category);

	const stateSnap = useSnapshot(groceriesState);
	const animateIn = stateSnap.justCreatedCategoryId === category.get('id');

	const items = hooks.useAllItems({
		index: {
			where: 'categoryId_sortKey',
			match: {
				categoryId: category.get('id'),
			},
			order: 'asc',
		},
	});

	const [isDragging, setIsDragging] = useState(false);
	const [isDraggingOver, setIsDraggingOver] = useState(false);
	useDndMonitor({
		onDragStart: () => {
			setIsDragging(true);
		},
		onDragEnd: () => {
			setIsDragging(false);
			setIsDraggingOver(false);
		},
		onDragOver: ({ over }) => {
			if (!over) {
				setIsDraggingOver(false);
				return;
			}
			const data = over.data.current as GroceryDnDDrop;
			if (data.type === 'category') {
				setIsDraggingOver(data.value === category.get('id'));
			} else if (data.type === 'item') {
				setIsDraggingOver(data.value.get('categoryId') === category.get('id'));
			} else {
				setIsDraggingOver(false);
			}
		},
		onDragCancel: () => {
			setIsDraggingOver(false);
		},
	});

	const empty = items?.length === 0;
	const snap = useSnapshot(groceriesState);
	const forceShow = snap.draggedItemOriginalCategory === category.get('id');

	const sortedIds = useMemo(
		() => items?.map((i) => i.get('id')) || [],
		[items],
	);

	if (empty && !forceShow) return null;

	return (
		<CategoryContainer
			className="groceryCategory"
			draggedOver={isDraggingOver}
			isItemDragging={isDragging}
			empty={empty}
			animateIn={animateIn}
			{...rest}
		>
			<SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
				<H2 size="micro" css={{ m: '$2', fontFamily: '$sans' }}>
					{category.get('name')}
				</H2>
				{items?.map((item, index) => {
					const prevItem = items[index - 1];
					const nextItem = items[index + 1];
					return (
						<MemoizedDraggableItem
							key={item.get('id')}
							item={item}
							nextSortKey={nextItem?.get('sortKey') || null}
							prevSortKey={prevItem?.get('sortKey') || null}
						/>
					);
				})}
			</SortableContext>
		</CategoryContainer>
	);
}

const MemoizedDraggableItem = memo(GroceryListItemDraggable);

const popIn = keyframes({
	'0%': {
		opacity: 0,
		transform: 'translateY(20px)',
	},
	'100%': {
		opacity: 1,
		transform: 'translateY(0px)',
	},
});

const CategoryContainer = styled('div', {
	display: 'flex',
	flexDirection: 'column',
	// p: '$2',
	gap: '$1',
	borderRadius: '$md',
	backgroundColor: '$light',
	transition: 'all 0.2s $springy',
	mb: '$4',

	variants: {
		draggedOver: {
			true: {
				backgroundColor: '$gray10',
			},
			false: {
				backgroundColor: '$light',
			},
		},
		isItemDragging: {
			true: {
				boxShadow: '0 0 0 1px $colors$gray30',
			},
			false: {},
		},
		empty: {
			true: {
				height: 0,
				opacity: 0,
				mb: 0,
				p: 0,
				transitionDelay: '0.2s',
			},
			false: {
				opacity: 1,
				height: 'auto',
				// p: '$2',
			},
		},
		animateIn: {
			true: {
				animation: `${popIn} 0.2s $transitions$springy`,
			},
		},
	},

	compoundVariants: [
		{
			isItemDragging: true,
			empty: true,
			css: {
				height: 80,
				opacity: 1,
				mb: '$4',
			},
		},
		{
			isItemDragging: true,
			draggedOver: false,
			css: {
				transform: 'scale(0.95)',
			},
		},
	],
});
