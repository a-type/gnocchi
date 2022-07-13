import { useQuery } from '@aphro/react';
import { UpdateType } from '@aphro/runtime-ts';
import { useDndMonitor, useDroppable } from '@dnd-kit/core';
import useMergedRef from '@react-hook/merged-ref';
import React, { forwardRef, useState } from 'react';
import { keyframes, styled } from 'stitches.config';
import GroceryCategory from 'stores/groceries/.generated/GroceryCategory';
import { useSnapshot } from 'valtio';
import { H2 } from '../primitives';
import { GroceryListItem, GroceryListItemDraggable } from './GroceryListItem';
import { groceriesState } from './state';

export function GroceryListCategory(props: { category: GroceryCategory }) {
	const stateSnap = useSnapshot(groceriesState);
	const isJustCreated = stateSnap.justCreatedCategoryId === props.category.id;
	return <CategoryContent {...props} animateIn={isJustCreated} />;
}

const CategoryContent = forwardRef<
	HTMLDivElement,
	{ category: GroceryCategory; animateIn?: boolean }
>(function CategoryContent({ category, ...rest }, ref) {
	const { data: items } = useQuery(() => category.queryItems(), []);
	const { isOver, setNodeRef } = useDroppable({
		id: category.id,
		data: {
			type: 'category',
			value: category.id,
		},
	});

	const [isDragging, setIsDragging] = useState(false);
	useDndMonitor({
		onDragStart: () => {
			setIsDragging(true);
		},
		onDragEnd: () => {
			setIsDragging(false);
		},
	});

	const empty = items.length === 0;

	const finalRef = useMergedRef(ref, setNodeRef);

	if (empty) return null;

	return (
		<CategoryContainer
			ref={finalRef}
			className="groceryCategory"
			draggedOver={isOver}
			isItemDragging={isDragging}
			empty={empty}
			{...rest}
		>
			<H2 size="micro" css={{ m: '$2' }}>
				{category.name}
			</H2>
			{items.map((item, index) => {
				return (
					<GroceryListItemDraggable key={item.id} item={item}>
						<GroceryListItem item={item} />
					</GroceryListItemDraggable>
				);
			})}
		</CategoryContainer>
	);
});

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
