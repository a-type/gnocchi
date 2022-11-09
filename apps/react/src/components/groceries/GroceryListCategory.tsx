import { useDndMonitor, useDroppable } from '@dnd-kit/core';
import React, {
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { keyframes, styled } from '@/stitches.config.js';
import { useSnapshot } from 'valtio';
import { Box, H2 } from '../primitives/index.js';
import { GroceryListItemDraggable } from './items/GroceryListItem.js';
import { groceriesState } from './state.js';
import { hooks, Category, Item } from '@/stores/groceries/index.js';
import { useDragDistance, useIsDragging } from './dndHooks.js';
import { animated, useSpring } from '@react-spring/web';
import useMergedRef from '@/hooks/useMergedRef.js';
import { lerp } from 'three/src/math/MathUtils.js';

const EMPTY_DROPPABLE_SIZE = 100;

export function GroceryListCategory({
	category,
	items,
	...rest
}: {
	category: Category | null;
	items: Item[];
}) {
	const empty = !items || items?.length === 0;

	const isDragging = useIsDragging();
	const internalRef = useRef<HTMLDivElement>(null);

	// remeasure natural height whenever items change
	const [height, setHeight] = useState(0);
	useEffect(() => {
		requestAnimationFrame(() => {
			if (internalRef.current) {
				const naturalHeight = internalRef.current.clientHeight;
				setHeight(naturalHeight);
				internalRef.current.style.setProperty(
					'--natural-height',
					`${naturalHeight}px`,
				);
			}
		});
	}, [items.length]);
	useDragDistance(
		50,
		(val) => {
			const element = internalRef.current;
			if (!element) return;
			if (val === 0) {
			} else {
				// compute the interpolated value from natural height to size based
				// on val
				const fromHeight = empty ? 0 : height;
				element.style.setProperty(
					'height',
					`${lerp(fromHeight, EMPTY_DROPPABLE_SIZE, val)}px`,
				);
				if (empty) {
					element.style.setProperty(
						'opacity',
						`${lerp(empty ? 0 : 1, 1, val)}`,
					);
					element.style.setProperty('margin-bottom', `${lerp(0, 16, val)}px`);
				}
			}
		},
		(finalVal) => {
			const element = internalRef.current;
			if (!element) return;
			element.style.removeProperty('height');
			element.style.removeProperty('opacity');
			element.style.removeProperty('margin-bottom');

			const fromHeight = empty ? 0 : height;
			element.animate(
				[
					{
						opacity: 1,
						height: `${lerp(fromHeight, EMPTY_DROPPABLE_SIZE, finalVal)}px`,
					},
					{
						opacity: empty ? 0 : 1,
						height: `${height}px`,
					},
				],
				{
					duration: 200,
					iterations: 1,
					easing: 'ease-in-out',
					fill: 'auto',
				},
			);
		},
	);

	const { setNodeRef, isOver } = useDroppable({
		id: category?.get('id') || 'null',
		data: {
			type: 'category',
			value: category?.get('id'),
		},
	});

	const finalRef = useMergedRef(internalRef, setNodeRef);

	return (
		<CategoryContainer
			className="groceryCategory"
			draggedOver={isOver}
			isItemDragging={isDragging}
			empty={empty}
			ref={finalRef}
			{...rest}
		>
			<H2 size="micro" css={{ m: '$2', fontFamily: '$sans' }}>
				{category?.get('name') ?? 'Uncategorized'}
			</H2>
			<CategoryItems isItemDragging={isDragging}>
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
			</CategoryItems>
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
	gap: '$1',
	borderRadius: '$md',
	backgroundColor: '$light',
	overflow: 'hidden',
	transition: 'box-shadow 0.2s $transitions$springy',
	'$$natural-height': '0px',

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
			},
			false: {
				mb: '$4',
				animation: `${popIn} 0.2s $transitions$springy`,
			},
		},
	},

	compoundVariants: [
		{
			isItemDragging: true,
			draggedOver: false,
			css: {
				transform: 'scale(0.95)',
			},
		},
	],
});

const CategoryItems = styled('div', {
	display: 'flex',
	flexDirection: 'column',
	gap: '$1',

	transition: 'opacity 0.2s $transitions$springy',

	variants: {
		isItemDragging: {
			true: {
				opacity: 0,
			},
			false: {
				opacity: 1,
			},
		},
	},
});
