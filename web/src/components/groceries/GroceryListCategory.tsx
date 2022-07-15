import { useBind, useQuery } from '@aphro/react';
import { useDndMonitor } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React, { memo, useMemo, useState } from 'react';
import { keyframes, styled } from 'stitches.config';
import GroceryCategory from 'stores/groceries/.generated/GroceryCategory';
import { useSnapshot } from 'valtio';
import { H2 } from '../primitives';
import { GroceryDnDDrop } from './dndTypes';
import { GroceryListItemDraggable } from './GroceryListItem';
import { groceriesState } from './state';

export function GroceryListCategory({
	category,
	...rest
}: {
	category: GroceryCategory;
}) {
	useBind(category, ['name']);

	const stateSnap = useSnapshot(groceriesState);
	const animateIn = stateSnap.justCreatedCategoryId === category.id;

	const { data: items } = useQuery(
		() => category.queryItems().orderBySortKey('asc'),
		[],
	);

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
				setIsDraggingOver(data.value === category.id);
			} else if (data.type === 'item') {
				setIsDraggingOver(data.value.categoryId === category.id);
			} else {
				setIsDraggingOver(false);
			}
		},
		onDragCancel: () => {
			setIsDraggingOver(false);
		},
	});

	const empty = items.length === 0;
	const snap = useSnapshot(groceriesState);
	const forceShow = snap.draggedItemOriginalCategory === category.id;

	const sortedIds = useMemo(() => items.map((i) => i.id), [items]);

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
				<H2 size="micro" css={{ m: '$2' }}>
					{category.name}
				</H2>
				{items.map((item, index) => {
					const prevItem = items[index - 1];
					const nextItem = items[index + 1];
					return (
						<MemoizedDraggableItem
							key={item.id}
							item={item}
							nextSortKey={nextItem?.sortKey || null}
							prevSortKey={prevItem?.sortKey || null}
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
	backgroundColor: '$white',
	transition: 'all 0.2s $springy',
	mb: '$4',

	variants: {
		draggedOver: {
			true: {
				backgroundColor: '$gray10',
			},
			false: {
				backgroundColor: '$white',
			},
		},
		isItemDragging: {
			true: {
				boxShadow: '0 0 0 2px $colors$gray30',
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
