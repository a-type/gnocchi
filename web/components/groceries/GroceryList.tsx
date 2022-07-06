import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	MouseSensor,
	TouchSensor,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Box } from 'components/primitives';
import {
	groceriesStore,
	GroceryItemData,
	setItemCategory,
} from 'lib/stores/groceries';
import { forwardRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ref as valtioRef, useSnapshot } from 'valtio';
import { GroceryDnDDrop } from './dndTypes';
import { GroceryListCategory } from './GroceryListCategory';
import { GroceryListItem } from './GroceryListItem';
import { GroceryNewCategoryFloater } from './GroceryNewCategoryFloater';
import { DeleteItemFloater } from './DeleteItemFloater';
import { groceriesState } from './state';
import { DRAG_ACTIVATION_DELAY } from './constants';

const DRAG_ACTIVATION_TOLERANCE = 5;

export interface GroceryListProps {
	className?: string;
}

export const GroceryList = forwardRef<HTMLDivElement, GroceryListProps>(
	function GroceryList({ ...rest }, ref) {
		const state = useSnapshot(groceriesStore);

		const [draggingItem, setDraggingItem] = useState<GroceryItemData | null>(
			null,
		);
		const handleDragStart = ({ active }: DragStartEvent) => {
			setDraggingItem(active.data.current as GroceryItemData);
		};
		const handleDragEnd = ({ over, active }: DragEndEvent) => {
			if (!over) return;

			const item = active.data.current as GroceryItemData;
			const dropZone = over.data.current as GroceryDnDDrop;
			if (dropZone.type === 'category') {
				if (item.category !== dropZone.value) {
					setItemCategory(item, dropZone.value);
				}
			} else if (dropZone.type === 'new') {
				groceriesState.newCategoryPendingItem = valtioRef(item);
			} else if (dropZone.type === 'delete') {
				const index = groceriesStore.items.findIndex((i) => i.id === item.id);
				groceriesStore.items.splice(index, 1);
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
					{state.categories.map((category) => {
						return (
							<GroceryListCategory key={category} categoryName={category} />
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
