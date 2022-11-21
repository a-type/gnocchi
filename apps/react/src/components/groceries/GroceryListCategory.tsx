import useMergedRef from '@/hooks/useMergedRef.js';
import { keyframes, styled } from '@/stitches.config.js';
import { Category, Item } from '@/stores/groceries/index.js';
import { useDndMonitor, useDroppable } from '@dnd-kit/core';
import { memo, useCallback, useRef } from 'react';
import { H2 } from '../primitives/index.js';
import { useIsDragging } from './dndHooks.js';
import { GroceryListItemDraggable } from './items/GroceryListItem.js';
import * as classes from './GroceryListCategory.css.js';

const EMPTY_DROPPABLE_SIZE = 48;

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
			<h2 className={classes.title}>
				{category?.get('name') ?? 'Uncategorized'}
			</h2>
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
						marginBottom: empty ? 0 : 'var(--ag-space-4)',
					},
					{
						height: `${EMPTY_DROPPABLE_SIZE}px`,
						opacity: 1,
						marginBottom: 'var(--ag-space-4)',
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
	transition:
		'box-shadow 0.2s $transitions$springy, transform 0.2s $transitions$springy, background-color 0.5s linear',

	variants: {
		draggedOver: {
			true: {
				backgroundColor: '$lemonLighter',
				borderColor: '$lemonDark',
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
		{
			empty: false,
			draggedOver: false,
			isItemDragging: false,
			css: {
				animationName: `${popIn}`,
				animationDuration: `0.2s`,
				animationTimingFunction: `$transitions$springy`,
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
