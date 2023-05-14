import useMergedRef from '@/hooks/useMergedRef.js';
import { Category, Item } from '@aglio/groceries-client';
import { useSizeCssVars } from '@aglio/ui/hooks';
import { vars } from '@aglio/ui/styles';
import { useDndMonitor, useDroppable } from '@dnd-kit/core';
import classNames from 'classnames';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useIsDragging } from '../dndHooks.js';
import { GroceryListItemDraggable } from '../items/GroceryListItem.js';
import * as classes from './GroceryListCategory.css.js';
import { CategoryClaim } from '@/components/groceries/categories/CategoryClaim.jsx';
import {
	CategoryTitle,
	CategoryTitleRow,
} from '@/components/groceries/categories/CategoryTitleRow.jsx';

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
	const { empty, mountedEmpty } = useCategoryItemVisibilityState(items);

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
		<div
			className={classNames('groceryCategory', classes.root)}
			data-dragged-over={isOver}
			data-is-item-dragging={isDragging}
			data-is-empty={empty}
			data-do-not-animate={mountedEmpty}
			ref={finalRef}
			{...rest}
		>
			<CategoryTitleRow>
				<CategoryTitle>
					{category?.get('name') ?? 'Uncategorized'}
				</CategoryTitle>
				{category && (
					<div className="flex flex-row items-center justify-between flex-grow-0 flex-shrink-0 flex-basis-auto">
						<CategoryClaim category={category} />
					</div>
				)}
			</CategoryTitleRow>
			<div
				className="flex flex-col transition-opacity duration-200 ease-springy [&data-is-item-dragging=true]:opacity-0"
				data-is-item-dragging={isDragging}
			>
				{items.map((item, index) => {
					return (
						<MemoizedDraggableItem
							key={item.get('id')}
							item={item}
							first={index === 0}
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

function useCategoryItemVisibilityState(items: Item[]) {
	const empty = items.length === 0;
	// set a flag if the component mounted empty. we don't animate
	// the collapse if this is the case to avoid rendering empty
	// categories on first mount
	const [mountedEmpty, setMountedEmpty] = useState(empty);
	useEffect(() => {
		if (!empty) {
			setMountedEmpty(false);
		}
	}, [empty]);

	return {
		empty,
		mountedEmpty,
	};
}
