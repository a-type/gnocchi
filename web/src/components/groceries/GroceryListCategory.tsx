import { useDndMonitor, useDroppable } from '@dnd-kit/core';
import useMergedRef from '@react-hook/merged-ref';
import { H2 } from '../primitives';
import React, { forwardRef, useState, useEffect } from 'react';
import GroceryCategory from 'stores/groceries/.generated/GroceryCategory';
import { styled, theme } from 'stitches.config';
import { useSnapshot } from 'valtio';
import { GroceryListItem, GroceryListItemDraggable } from './GroceryListItem';
import { groceriesState, newCategoryFlipData } from './state';
import { unwrap, unwraps, useQuery } from '@aphro/react';
import { UpdateType } from '@aphro/runtime-ts';

export function GroceryListCategory(props: { category: GroceryCategory }) {
	const stateSnap = useSnapshot(groceriesState);
	const isJustCreated = stateSnap.justCreatedCategoryId === props.category.id;
	const [measuring, setMeasuring] = useState(isJustCreated);
	useEffect(() => {
		if (isJustCreated) {
			setMeasuring(true);
		}
	}, [isJustCreated]);

	const measureAndFlip = (element: HTMLDivElement | null) => {
		if (!element) return;
		setMeasuring(false);
		const target = newCategoryFlipData.current;
		if (!target) {
			console.log('no flip data');
			// bad state
			groceriesState.justCreatedCategoryId = null;
			return;
		}

		const box = element.getBoundingClientRect();
		// apply inverse
		const transform = `translate(${target.left - box.left}px, ${
			target.top - box.top
		}px)`;
		const transitionLength = 200;
		console.log('transform', transform);
		element.style.transition = 'none';
		element.style.transform = transform;
		element.style.width = `${target.width}px`;
		element.style.height = `${target.height}px`;
		element.style.overflow = 'hidden';
		element.style.zIndex = '999';
		element.style.backgroundColor = theme.colors.lemon.value;
		requestAnimationFrame(() => {
			element.style.transition = `all ${transitionLength}ms ease-in-out`;
			element.style.transform = 'translate(0px, 0px)';
			element.style.width = `${box.width}px`;
			element.style.height = `${box.height}px`;
			element.style.removeProperty('background-color');
			element.style.removeProperty('overflow');
			element.style.removeProperty('z-index');
			setTimeout(() => {
				element.style.removeProperty('transition');
				element.style.removeProperty('width');
				element.style.removeProperty('height');
				element.style.removeProperty('transform');
			}, transitionLength);
		});

		groceriesState.justCreatedCategoryId = null;
		newCategoryFlipData.current = null;
	};

	return (
		<CategoryContent {...props} ref={measuring ? measureAndFlip : undefined} />
	);
}

const CategoryContent = forwardRef<
	HTMLDivElement,
	{ category: GroceryCategory }
>(function CategoryContent({ category, ...rest }, ref) {
	const [items] = unwraps(
		useQuery(UpdateType.ANY, () => category.queryItems(), []),
	);
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
				transform: 'scale(0.99)',
			},
		},
	],
});
