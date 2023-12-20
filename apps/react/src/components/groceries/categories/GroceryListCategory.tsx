import useMergedRef from '@/hooks/useMergedRef.js';
import { Category, Item } from '@aglio/groceries-client';
import { useSizeCssVars, withClassName } from '@a-type/ui/hooks';
import { useDndMonitor, useDroppable } from '@dnd-kit/core';
import classNames from 'classnames';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useIsDragging } from '../dndHooks.js';
import { GroceryListItemDraggable } from '../items/GroceryListItem.js';
import { CategoryClaim } from '@/components/groceries/categories/CategoryClaim.jsx';
import {
	CategoryTitle,
	CategoryTitleRow,
} from '@/components/groceries/categories/CategoryTitleRow.jsx';
import './GroceryListCategory.css';

const EMPTY_DROPPABLE_SIZE = 48;

export function GroceryListCategory({
	category,
	items,
	first,
	...rest
}: {
	category: Category | null;
	items: Item[];
	first?: boolean;
}) {
	const { empty, mountedEmpty, justMounted } =
		useCategoryItemVisibilityState(items);

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

	const measureRef = useSizeCssVars(300);

	const finalRef = useMergedRef(internalRef, setNodeRef, measureRef);

	return (
		<CategoryRoot
			className={classNames('groceryCategory')}
			data-dragged-over={isOver}
			data-is-item-dragging={isDragging}
			data-is-empty={empty}
			data-do-not-animate={justMounted}
			data-pop-in={mountedEmpty && !empty}
			ref={finalRef}
			{...rest}
		>
			<CategoryTitleRow>
				<CategoryTitle>
					{category?.get('name') ?? 'Uncategorized'}
				</CategoryTitle>
				{category && (
					<div className="ml-auto mr-1 flex flex-row items-center justify-between flex-grow-0 flex-shrink-0 flex-basis-auto">
						<CategoryClaim category={category} />
					</div>
				)}
			</CategoryTitleRow>
			<CategoryItems data-is-item-dragging={isDragging}>
				{items.map((item, index) => {
					return (
						<MemoizedDraggableItem
							key={item.get('id')}
							item={item}
							first={index === 0}
						/>
					);
				})}
			</CategoryItems>
		</CategoryRoot>
	);
}

export const CategoryRoot = withClassName(
	'div',
	'flex flex-col rounded-md bg-wash overflow-hidden ease-springy transition mb-2',
	'[&[data-dragged-over=true]]:(bg-primary-wash ring ring-primary-dark)',
	'[&[data-is-item-dragging=true]]:(ring ring-gray-3 mb-0)',
	'[&[data-is-empty=true]:not([data-is-item-dragging=true])]:(h-0 op-0 pointer-events-none mb-0 [animation-name:category-collapse] animate animate-duration-200 animate-ease-default animate-forwards [visibility:hidden])',
	'important:[&[data-do-not-animate=true]]:(animate-none) important:motion-reduce:animate-none',
	'[&[data-is-item-dragging=true][data-dragged-over=false]]:(scale-95)',
	'[&[data-pop-in=true][data-dragged-over=false][data-is-item-dragging=false]]:(animate-keyframes-fade-in-up animate-duration-200 animate-ease-springy)',
	'focus-visible:(color-primary-dark outline-1 outline-solid outline-primary)',
);

export const CategoryItems = withClassName(
	'div',
	'flex flex-col transition-opacity duration-200 ease-springy [&[data-is-item-dragging=true]]:op-0',
);

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
						marginBottom: empty ? 0 : '16px',
					},
					{
						height: `${EMPTY_DROPPABLE_SIZE}px`,
						opacity: 1,
						marginBottom: '16px',
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

function useCategoryItemVisibilityState(items: Item[]) {
	const empty = items.length === 0;
	const justMounted = useRef(true);
	useEffect(() => {
		justMounted.current = false;
	}, []);
	const mountedEmpty = useRef(empty);

	return {
		empty,
		mountedEmpty: mountedEmpty.current,
		justMounted: justMounted.current,
	};
}
