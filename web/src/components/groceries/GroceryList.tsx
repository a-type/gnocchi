import { useQuery } from '@aphro/react';
import { Context } from '@aphro/runtime-ts';
import {
	DndContext,
	DragCancelEvent,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	KeyboardSensor,
	MeasuringStrategy,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useGroceryListCtx } from 'contexts/GroceryListContext';
import { generateKeyBetween } from 'fractional-indexing';
import React, { forwardRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import GroceryCategory from 'stores/groceries/.generated/GroceryCategory';
import GroceryItem from 'stores/groceries/.generated/GroceryItem';
import { setItemCategory } from 'stores/groceries/mutations';
import { ref as valtioRef } from 'valtio';
import { Box } from '../primitives';
import {
	DESKTOP_DRAG_ACTIVATION_DELAY,
	MOBILE_DRAG_ACTIVATION_DELAY,
} from './constants';
import { DeleteItemFloater } from './DeleteItemFloater';
import { GroceryDnDDrag, GroceryDnDDrop } from './dndTypes';
import { GroceryListCategory } from './GroceryListCategory';
import { GroceryListItem } from './GroceryListItem';
import { GroceryNewCategoryFloater } from './GroceryNewCategoryFloater';
import { groceriesState } from './state';

const DRAG_ACTIVATION_TOLERANCE = 5;

export interface GroceryListProps {
	className?: string;
}

export const GroceryList = forwardRef<HTMLDivElement, GroceryListProps>(
	function GroceryList({ ...rest }, ref) {
		const ctx = useGroceryListCtx();
		const { data: categories } = useQuery(
			() => GroceryCategory.queryAll(ctx),
			[],
		);

		const [draggingItem, setDraggingItem] = useState<GroceryItem | null>(null);
		const handleDragStart = ({ active }: DragStartEvent) => {
			const item = (active.data.current as GroceryDnDDrag).value;
			setDraggingItem(item);
			groceriesState.draggedItemOriginalCategory = item.categoryId;
			groceriesState.draggedItemOriginalSortKey = item.sortKey;
		};

		const resetDragStuff = useCallback(() => {
			setDraggingItem(null);
		}, []);

		const handleDragEnd = useOnDragEnd(ctx, resetDragStuff);
		const handleDragOver = useOnDragOver();
		const handleDragCancel = useOnDragCancel(resetDragStuff);

		const sensors = useGroceryDndSensors();

		return (
			<DndContext
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDragOver={handleDragOver}
				onDragCancel={handleDragCancel}
				sensors={sensors}
				measuring={{
					droppable: {
						strategy: MeasuringStrategy.Always,
					},
				}}
			>
				<Box id="groceryList" w="full" flex={1} p={2} ref={ref} {...rest}>
					{categories.map((category) => {
						return (
							<GroceryListCategory key={category.id} category={category} />
						);
					})}
				</Box>
				<GroceryNewCategoryFloater />
				<DeleteItemFloater />
				{createPortal(
					<DragOverlay dropAnimation={null}>
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

function isMobile() {
	let check = false;
	(function (a) {
		if (
			/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
				a,
			) ||
			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
				a.substr(0, 4),
			)
		)
			check = true;
	})(navigator.userAgent || navigator.vendor || (window as any).opera);
	return check;
}

function useGroceryDndSensors() {
	const mobile = isMobile();
	const mouseSensor = useSensor(MouseSensor, {
		activationConstraint: {
			delay: mobile
				? MOBILE_DRAG_ACTIVATION_DELAY
				: DESKTOP_DRAG_ACTIVATION_DELAY,
			tolerance: DRAG_ACTIVATION_TOLERANCE,
		},
	});
	const touchSensor = useSensor(TouchSensor, {
		activationConstraint: {
			delay: mobile
				? MOBILE_DRAG_ACTIVATION_DELAY
				: DESKTOP_DRAG_ACTIVATION_DELAY,
			tolerance: DRAG_ACTIVATION_TOLERANCE,
		},
	});
	const keyboardSensor = useSensor(KeyboardSensor, {
		coordinateGetter: sortableKeyboardCoordinates,
	});
	return useSensors(mouseSensor, touchSensor, keyboardSensor);
}

function useOnDragEnd(ctx: Context, onEnd: () => void) {
	return useCallback(
		async ({ over, active }: DragEndEvent) => {
			const item = (active.data.current as GroceryDnDDrag).value;

			if (!over) {
				// they dropped on nothing... cancel any movement
				await item
					.update({
						categoryId: groceriesState.draggedItemOriginalCategory,
						sortKey: groceriesState.draggedItemOriginalSortKey,
					})
					.save();
				return;
			}

			const dropZone = over.data.current as GroceryDnDDrop;
			if (dropZone.type === 'category') {
				if (item.categoryId !== dropZone.value) {
					await setItemCategory(ctx, item, dropZone.value);
				}
			} else if (dropZone.type === 'new') {
				groceriesState.newCategoryPendingItem = valtioRef(item);
			} else if (dropZone.type === 'delete') {
				item.delete().save();
			} else if (dropZone.type === 'item') {
				const dropItem = dropZone.value;
				console.log('item', item.name, 'dropped on', dropZone.value.name);
				let sortKey: string;
				const isBefore = dropItem.sortKey < item.sortKey;

				if (isBefore) {
					sortKey = generateKeyBetween(dropZone.prevSortKey, dropItem.sortKey);
				} else {
					// generate a key between them
					sortKey = generateKeyBetween(
						dropZone.value.sortKey,
						dropZone.nextSortKey,
					);
				}

				await item
					.update({
						sortKey,
						// it might also move categories if the drop item
						// is in a different category
						categoryId: dropItem.categoryId,
					})
					.save();
			}
			onEnd();
		},
		[ctx, onEnd],
	);
}

function useOnDragOver() {
	return useCallback(async ({ over, active }: DragOverEvent) => {
		if (!over) return;

		const item = (active.data.current as GroceryDnDDrag).value;
		const dropZone = over.data.current as GroceryDnDDrop;
		if (dropZone.type === 'item') {
			const dropItem = dropZone.value;
			console.log('item', item.name, 'dropped on', dropZone.value.name);
			let sortKey: string;
			const isBefore = dropItem.sortKey < item.sortKey;

			if (isBefore) {
				sortKey = generateKeyBetween(dropZone.prevSortKey, dropItem.sortKey);
			} else {
				// generate a key between them
				sortKey = generateKeyBetween(
					dropZone.value.sortKey,
					dropZone.nextSortKey,
				);
			}

			await item
				.update({
					sortKey,
					// it might also move categories if the drop item
					// is in a different category
					categoryId: dropItem.categoryId,
				})
				.save();
		}
	}, []);
}

function useOnDragCancel(reset: () => void) {
	return useCallback(
		({ active }: DragCancelEvent) => {
			console.log('CANCEL');
			if (active) {
				const dragged = active.data.current as GroceryDnDDrag;
				dragged.value
					.update({
						categoryId: groceriesState.draggedItemOriginalCategory,
						sortKey: groceriesState.draggedItemOriginalSortKey,
					})
					.save();
			}
			reset();
		},
		[reset],
	);
}

// function useCustomCollisionStrategy(items: GroceryItem[], activeItem: GroceryItem | null) {
// 	const activeId = activeItem?.id;
// 	return useCallback(
//     (args: Parameters<CollisionDetection>[0]) => {
//       if (activeId && activeId in items) {
//         return closestCenter({
//           ...args,
//           droppableContainers: args.droppableContainers.filter(
//             (container) => container.id in items
//           ),
//         });
//       }

//       // Start by finding any intersecting droppable
//       const pointerIntersections = pointerWithin(args);
//       const intersections =
//         pointerIntersections.length > 0
//           ? // If there are droppables intersecting with the pointer, return those
//             pointerIntersections
//           : rectIntersection(args);
//       let overId = getFirstCollision(intersections, 'id');

//       if (overId != null) {
//         if (overId === '@@delete') {
//           // If the intersecting droppable is the trash, return early
//           // Remove this if you're not using trashable functionality in your app
//           return intersections;
//         }

//         if (overId in items) {
//           const containerItems = items[overId];

//           // If a container is matched and it contains items (columns 'A', 'B', 'C')
//           if (containerItems.length > 0) {
//             // Return the closest droppable within that container
//             overId = closestCenter({
//               ...args,
//               droppableContainers: args.droppableContainers.filter(
//                 (container) =>
//                   container.id !== overId &&
//                   containerItems.includes(container.id)
//               ),
//             })[0]?.id;
//           }
//         }

//         lastOverId.current = overId;

//         return [{id: overId}];
//       }

//       // When a draggable item moves to a new container, the layout may shift
//       // and the `overId` may become `null`. We manually set the cached `lastOverId`
//       // to the id of the draggable item that was moved to the new container, otherwise
//       // the previous `overId` will be returned which can cause items to incorrectly shift positions
//       if (recentlyMovedToNewContainer.current) {
//         lastOverId.current = activeId;
//       }

//       // If no droppable is matched, return the last match
//       return lastOverId.current ? [{id: lastOverId.current}] : [];
//     },
//     [activeId, items]
//   );
// }
