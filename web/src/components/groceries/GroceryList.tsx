import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	KeyboardSensor,
	useSensor,
	useSensors,
	MouseSensor,
	TouchSensor,
} from '@dnd-kit/core';
import { ref as valtioRef } from 'valtio';
import { Box } from '../primitives';
import React, { forwardRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { GroceryDnDDrop } from './dndTypes';
import { GroceryListCategory } from './GroceryListCategory';
import { GroceryListItem } from './GroceryListItem';
import { GroceryNewCategoryFloater } from './GroceryNewCategoryFloater';
import { DeleteItemFloater } from './DeleteItemFloater';
import { groceriesState } from './state';
import { DRAG_ACTIVATION_DELAY } from './constants';
import { useGroceryListCtx } from 'contexts/GroceryListContext';
import GroceryItem from 'stores/groceries/.generated/GroceryItem';
import { commit, UpdateType } from '@aphro/runtime-ts';
import GroceryItemMutations from 'stores/groceries/.generated/GroceryItemMutations';
import { unwraps, useQuery } from '@aphro/react';
import GroceryCategory from 'stores/groceries/.generated/GroceryCategory';

const DRAG_ACTIVATION_TOLERANCE = 5;

export interface GroceryListProps {
	className?: string;
}

export const GroceryList = forwardRef<HTMLDivElement, GroceryListProps>(
	function GroceryList({ ...rest }, ref) {
		const ctx = useGroceryListCtx();
		const [categories] = unwraps(
			useQuery(
				UpdateType.CREATE_OR_DELETE,
				() => GroceryCategory.queryAll(ctx),
				[],
			),
		);

		const [draggingItem, setDraggingItem] = useState<GroceryItem | null>(null);
		const handleDragStart = ({ active }: DragStartEvent) => {
			setDraggingItem(active.data.current as GroceryItem);
		};
		const handleDragEnd = ({ over, active }: DragEndEvent) => {
			if (!over) return;

			const item = active.data.current as GroceryItem;
			const dropZone = over.data.current as GroceryDnDDrop;
			if (dropZone.type === 'category') {
				if (item.categoryId !== dropZone.value) {
					commit(item.ctx, [
						GroceryItemMutations.setCategory(item, {
							categoryId: dropZone.value,
						}).toChangeset(),
					]);
				}
			} else if (dropZone.type === 'new') {
				groceriesState.newCategoryPendingItem = valtioRef(item);
			} else if (dropZone.type === 'delete') {
				commit(item.ctx, [GroceryItemMutations.delete(item, {}).toChangeset()]);
			}
			setDraggingItem(null);
		};

		const sensors = useGroceryDndSensors();

		return (
			<DndContext
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				// modifiers={[restrictToVerticalAxis]}
				sensors={sensors}
			>
				<Box
					id="groceryList"
					w="full"
					flex={1}
					p={2}
					css={
						{
							// overflowY: 'auto',
							// overflowX: 'hidden',
						}
					}
					ref={ref}
					{...rest}
				>
					{categories.map((category) => {
						return (
							<GroceryListCategory key={category.id} category={category} />
						);
					})}
				</Box>
				<GroceryNewCategoryFloater />
				<DeleteItemFloater />
				{createPortal(
					<DragOverlay>
						{draggingItem && (
							<GroceryListItem isDragActive item={draggingItem} />
						)}
					</DragOverlay>,
					document.body,
				)}
			</DndContext>
		);
	},
);

export default GroceryList;

function useGroceryDndSensors() {
	const mouseSensor = useSensor(MouseSensor, {
		activationConstraint: {
			delay: DRAG_ACTIVATION_DELAY,
			tolerance: DRAG_ACTIVATION_TOLERANCE,
		},
	});
	const touchSensor = useSensor(TouchSensor, {
		activationConstraint: {
			delay: DRAG_ACTIVATION_DELAY,
			tolerance: DRAG_ACTIVATION_TOLERANCE,
		},
	});
	const keyboardSensor = useSensor(KeyboardSensor);
	return useSensors(mouseSensor, touchSensor, keyboardSensor);
}
