import useMergedRef from '@/hooks/useMergedRef.js';
import { keyframes, styled } from '@/stitches.config.js';
import { Category, Item } from '@/stores/groceries/index.js';
import { useDndMonitor, useDroppable } from '@dnd-kit/core';
import { memo, useRef } from 'react';
import { H2 } from '../primitives/index.js';
import { useIsDragging } from './dndHooks.js';
import { GroceryListItemDraggable } from './items/GroceryListItem.js';

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

	useDragExpansion({ internalRef, empty });

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

/**
 * Controls the animation of expanding and collapsing hidden categories
 * while the user is dragging
 */
function useDragExpansion({
	internalRef,
	empty,
}: {
	internalRef: React.RefObject<HTMLDivElement>;
	empty: boolean;
}) {
	const heightPriorToDragRef = useRef(0);
	useDndMonitor({
		onDragStart: () => {
			const element = internalRef.current;
			if (!element) return;

			heightPriorToDragRef.current = element.clientHeight;

			element.animate(
				[
					{
						height: `${element.clientHeight}px`,
						opacity: empty ? 0 : 1,
						marginBottom: empty ? 0 : 'var(--ag-space-4)',
					},
					{
						height: `${EMPTY_DROPPABLE_SIZE}px`,
						opacity: 1,
						marginBottom: 'var(--ag-space-4)',
					},
				],
				{
					duration: 200,
					iterations: 1,
					easing: 'ease-in-out',
					fill: 'forwards',
				},
			);
		},
		onDragEnd: () => {
			const element = internalRef.current;
			if (!element) return;

			element.getAnimations().forEach((animation) => {
				animation.cancel();
			});

			element.animate(
				[
					{
						opacity: 1,
						height: `${EMPTY_DROPPABLE_SIZE}px`,
					},
					{
						opacity: empty ? 0 : 1,
						height: `${empty ? heightPriorToDragRef.current : 0}px`,
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
		onDragCancel: () => {
			const element = internalRef.current;
			if (!element) return;

			element.getAnimations().forEach((animation) => {
				animation.cancel();
			});

			element.animate(
				[
					{
						opacity: 1,
						height: `${EMPTY_DROPPABLE_SIZE}px`,
					},
					{
						opacity: empty ? 0 : 1,
						height: `${heightPriorToDragRef.current}px`,
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
	});
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
