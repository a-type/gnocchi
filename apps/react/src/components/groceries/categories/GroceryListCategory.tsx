import useMergedRef from '@/hooks/useMergedRef.js';
import { Category, Item } from '@/stores/groceries/index.js';
import { useDndMonitor, useDroppable } from '@dnd-kit/core';
import { memo, useCallback, useRef } from 'react';
import { useIsDragging } from '../dndHooks.js';
import { GroceryListItemDraggable } from '../items/GroceryListItem.js';
import { clsx } from 'clsx';
import * as classes from './GroceryListCategory.css.js';
import { vars } from '@/theme.css.js';
import { useSnapshot } from 'valtio';
import { groceriesState } from '../state.js';

const EMPTY_DROPPABLE_SIZE = 48;

export function GroceryListCategory({
	category,
	items,
	...rest
}: {
	category: Category | null;
	items: Item[];
}) {
	const recentlyPurchased = useSnapshot(groceriesState.recentlyPurchasedItems);
	const visibleItems = items.filter((item) => {
		return !item.get('purchasedAt') || recentlyPurchased.has(item.get('id'));
	});
	const empty = visibleItems.length === 0;

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
		<div
			className={clsx('groceryCategory', classes.root)}
			data-dragged-over={isOver}
			data-is-item-dragging={isDragging}
			data-is-empty={empty}
			ref={finalRef}
			{...rest}
		>
			<h2 className={classes.title}>
				{category?.get('name') ?? 'Uncategorized'}
			</h2>
			<div className={classes.items} data-is-item-dragging={isDragging}>
				{visibleItems.map((item, index) => {
					const prevItem = visibleItems[index - 1];
					const nextItem = visibleItems[index + 1];
					return (
						<MemoizedDraggableItem
							key={item.get('id')}
							item={item}
							nextSortKey={nextItem?.get('sortKey') || null}
							prevSortKey={prevItem?.get('sortKey') || null}
						/>
					);
				})}
			</div>
		</div>
	);
}

function waitForAnimationCancel(animation: Animation) {
	return new Promise((resolve) => {
		animation.cancel();
		animation.addEventListener('cancel', resolve);
	});
}

const animationTiming = 200;
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
	const priorAnimationRef = useRef<Animation>();

	const collapse = useCallback(async () => {
		const element = internalRef.current;
		if (!element) return;

		priorAnimationRef.current?.cancel();

		for (const animation of element.getAnimations()) {
			await waitForAnimationCancel(animation);
		}

		element.animate(
			[
				{
					opacity: 1,
					height: `${EMPTY_DROPPABLE_SIZE}px`,
				},
				{
					opacity: empty ? 0 : 1,
					height: `${empty ? 0 : heightPriorToDragRef.current}px`,
				},
			],
			{
				duration: animationTiming,
				iterations: 1,
				easing: 'ease-in-out',
				fill: 'auto',
			},
		);
	}, [empty, internalRef]);

	useDndMonitor({
		onDragStart: () => {
			const element = internalRef.current;
			if (!element) return;

			heightPriorToDragRef.current = element.clientHeight;

			priorAnimationRef.current = element.animate(
				[
					{
						height: `${element.clientHeight}px`,
						opacity: empty ? 0 : 1,
						marginBottom: empty ? 0 : vars.space[4],
					},
					{
						height: `${EMPTY_DROPPABLE_SIZE}px`,
						opacity: 1,
						marginBottom: vars.space[4],
					},
				],
				{
					duration: animationTiming,
					iterations: 1,
					easing: 'ease-in-out',
					fill: 'forwards',
				},
			);
		},
		onDragEnd: collapse,
		onDragCancel: collapse,
	});
}

const MemoizedDraggableItem = memo(GroceryListItemDraggable);
