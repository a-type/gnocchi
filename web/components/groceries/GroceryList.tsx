import { forwardRef, useState } from 'react';
import { useSnapshot, ref as valtioRef } from 'valtio';
import {
	groceriesCategories,
	groceriesStore,
	GroceryItemData,
} from 'lib/stores/groceries';
import { GroceryListItem, GroceryListItemDraggable } from './GroceryListItem';
import { Box, H2 } from 'components/primitives';
import {
	DndContext,
	DragEndEvent,
	useDroppable,
	useDndContext,
	useDndMonitor,
	DragStartEvent,
	DragOverlay,
} from '@dnd-kit/core';
import { GroceryNewCategoryFloater } from './GroceryNewCategoryFloater';
import { createPortal } from 'react-dom';
import { GroceryDnDDrop } from './dndTypes';
import { groceriesState } from './state';

export interface GroceryListProps {
	className?: string;
}

export const GroceryList = forwardRef<HTMLDivElement, GroceryListProps>(
	function GroceryList({ ...rest }, ref) {
		const state = useSnapshot(groceriesCategories);

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
					console.debug('moving item', item.id, 'to', dropZone.value);
					item.category = dropZone.value;
				}
			} else if (dropZone.type === 'new') {
				groceriesState.newCategoryPendingItem = valtioRef(item);
			}
			setDraggingItem(null);
		};

		return (
			<DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
				<Box
					id="groceryList"
					w="full"
					flex={1}
					p={2}
					gap={3}
					css={{
						overflow: 'hidden',
					}}
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
				{createPortal(
					<DragOverlay>
						{draggingItem && <GroceryListItem item={draggingItem} />}
					</DragOverlay>,
					document.body,
				)}
			</DndContext>
		);
	},
);

export default GroceryList;

function GroceryListCategory({
	categoryName,
	...rest
}: {
	categoryName: string;
}) {
	const items = useSnapshot(groceriesStore.items);
	const { isOver, setNodeRef } = useDroppable({
		id: categoryName,
		data: {
			type: 'category',
			value: categoryName,
		},
	});
	const [addRoom, setAddRoom] = useState(false);
	useDndMonitor({
		onDragStart() {
			setAddRoom(true);
		},
		onDragEnd() {
			setAddRoom(false);
		},
	});

	return (
		<Box
			ref={setNodeRef}
			className="groceryCategory"
			p={2}
			gap={1}
			css={{
				borderRadius: '$md',
				pb: addRoom ? '100px' : '$2',
				backgroundColor: isOver ? '$gray20' : 'transparent',
			}}
			{...rest}
		>
			<H2 css={{ textTransform: 'capitalize' }}>{categoryName}</H2>
			{items.map((item, index) => {
				if (item.category !== categoryName) return null;
				return (
					<GroceryListItemDraggable
						key={item.id}
						item={groceriesStore.items[index]}
					>
						<GroceryListItem item={groceriesStore.items[index]} />
					</GroceryListItemDraggable>
				);
			})}
		</Box>
	);
}
