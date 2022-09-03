import {
	DndContext,
	DragCancelEvent,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useDndMonitor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { generateKeyBetween } from 'fractional-indexing';
import React, {
	forwardRef,
	memo,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { createPortal } from 'react-dom';
import { groceries, hooks, GroceryItem } from 'stores/groceries/index.js';
import { ref as valtioRef } from 'valtio';
import { Box } from '../primitives/index.js';
import { DeleteItemFloater } from './DeleteItemFloater.js';
import { GroceryDnDDrag, GroceryDnDDrop } from './dndTypes.js';
import { GroceryListCategory } from './GroceryListCategory.js';
import { GroceryListItem } from './items/GroceryListItem.js';
import { GroceryNewCategoryFloater } from './GroceryNewCategoryFloater.js';
import { groceriesState } from './state.js';
import { useAuth } from 'contexts/AuthContext.js';

export interface GroceryListProps {
	className?: string;
}

const MemoizedCategory = memo(GroceryListCategory);

export const GroceryList = forwardRef<HTMLDivElement, GroceryListProps>(
	function GroceryList({ ...rest }, ref) {
		const handleDragStart = useOnDragStart();
		const handleDragEnd = useOnDragEnd();
		const handleDragOver = useOnDragOver();
		const handleDragCancel = useOnDragCancel();

		const sensors = useGroceryDndSensors();

		useGrocerySync();

		return (
			<DndContext
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDragOver={handleDragOver}
				onDragCancel={handleDragCancel}
				sensors={sensors}
			>
				<GroceryListCategories {...rest} ref={ref} />
				<GroceryNewCategoryFloater />
				<DeleteItemFloater />
				<GroceryListDragOverlay />
			</DndContext>
		);
	},
);

export default GroceryList;

function useGrocerySync() {
	const session = useAuth();
	useEffect(() => {
		if (session) {
			groceries.sync.goOnline();
		} else {
			groceries.sync.goOffline();
		}
	}, [session]);
}

const GroceryListCategories = forwardRef<
	HTMLDivElement,
	{ className?: string }
>(function GroceryListCategories(props, ref) {
	const categories = hooks.useAllCategories();

	return (
		<Box id="groceryList" w="full" flex={1} p={2} ref={ref} {...props}>
			{categories?.map((category) => {
				return <MemoizedCategory key={category.id} category={category} />;
			})}
		</Box>
	);
});

function GroceryListDragOverlay() {
	const [draggingItem, setDraggingItem] = useState<GroceryItem | null>(null);
	useDndMonitor({
		onDragStart: ({ active }) => {
			const item = (active.data.current as GroceryDnDDrag).value;
			setDraggingItem(item);
		},
		onDragEnd: () => {
			setDraggingItem(null);
		},
		onDragCancel: () => {
			setDraggingItem(null);
		},
	});

	return createPortal(
		<DragOverlay dropAnimation={null}>
			{draggingItem && <GroceryListItem isDragActive item={draggingItem} />}
		</DragOverlay>,
		document.body,
	);
}

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
			distance: 20,
		},
	});
	const touchSensor = useSensor(TouchSensor, {
		activationConstraint: {
			distance: 20,
		},
	});
	const keyboardSensor = useSensor(KeyboardSensor, {
		coordinateGetter: sortableKeyboardCoordinates,
	});
	return useSensors(mouseSensor, touchSensor, keyboardSensor);
}

function useOnDragStart() {
	return useCallback(({ active }: DragStartEvent) => {
		const item = (active.data.current as GroceryDnDDrag).value;
		groceriesState.draggedItemOriginalCategory = item.categoryId;
		groceriesState.draggedItemOriginalSortKey = item.sortKey;
		groceriesState.isAnyItemDragged = true;
	}, []);
}

function useOnDragEnd() {
	return useCallback(async ({ over, active }: DragEndEvent) => {
		const item = (active.data.current as GroceryDnDDrag).value;

		if (!over) {
			// they dropped on nothing... cancel any movement
			item.$update({
				categoryId: groceriesState.draggedItemOriginalCategory,
				sortKey: groceriesState.draggedItemOriginalSortKey,
			});
		} else {
			const dropZone = over.data.current as GroceryDnDDrop;
			if (dropZone.type === 'category') {
				if (item.categoryId !== dropZone.value) {
					await groceries.setItemCategory(item, dropZone.value);
				}
			} else if (dropZone.type === 'new') {
				groceriesState.newCategoryPendingItem = valtioRef(item);
			} else if (dropZone.type === 'delete') {
				await groceries.deleteItem(item);
			} else if (dropZone.type === 'item') {
				// reorderItem(item, dropZone);
			}
		}
		groceriesState.draggedItemOriginalCategory = null;
		groceriesState.draggedItemOriginalSortKey = null;
		groceriesState.isAnyItemDragged = false;
	}, []);
}

function useOnDragOver() {
	return useCallback(async ({ over, active }: DragOverEvent) => {
		if (!over) return;

		const item = (active.data.current as GroceryDnDDrag).value;
		const dropZone = over.data.current as GroceryDnDDrop;
		if (dropZone.type === 'item') {
			console.info(
				item.food,
				item.sortKey,
				'over',
				dropZone.value.food,
				dropZone.value.sortKey,
			);
			reorderItem(item, dropZone);
		}
	}, []);
}

function reorderItem(draggedItem: GroceryItem, dropZone: GroceryDnDDrag) {
	if (draggedItem.id === dropZone.value.id) return;

	let sortKey: string;

	if (dropZone.value.sortKey < draggedItem.sortKey) {
		sortKey = generateKeyBetween(dropZone.prevSortKey, dropZone.value.sortKey);
		console.debug(
			'dragged > droppped',
			sortKey,
			'generated between',
			dropZone.prevSortKey,
			dropZone.value.sortKey,
		);
	} else if (dropZone.value.sortKey > draggedItem.sortKey) {
		// generate a key between them
		sortKey = generateKeyBetween(dropZone.value.sortKey, dropZone.nextSortKey);
		console.debug(
			'dragged < dropped',
			sortKey,
			'generated between',
			dropZone.value.sortKey,
			dropZone.nextSortKey,
		);
	} else {
		// problem... sort keys are the same.
		// this should never happen in theory but could :/
		console.warn(
			'identical sortKeys',
			draggedItem.sortKey,
			dropZone.value.sortKey,
		);
		sortKey = generateKeyBetween(null, dropZone.value.sortKey);
	}

	groceries.setItemPosition(draggedItem, sortKey, dropZone.value.categoryId);
}

function useOnDragCancel() {
	return useCallback(({ active }: DragCancelEvent) => {
		if (active) {
			const dragged = active.data.current as GroceryDnDDrag;
			dragged.value.$update({
				categoryId: groceriesState.draggedItemOriginalCategory,
				sortKey: groceriesState.draggedItemOriginalSortKey,
			});
		}
	}, []);
}
