import { useListId } from '@/contexts/ListContext.jsx';
import { firstTimeOnboarding } from '@/onboarding/firstTimeOnboarding.js';
import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';
import { hooks } from '@/stores/groceries/index.js';
import { Item } from '@aglio/groceries-client';
import { H3, P } from '@aglio/ui/components/typography';
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
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { forwardRef, memo, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { ref as valtioRef } from 'valtio';
import { OnboardingBanner } from '../onboarding/OnboardingBanner.jsx';
import { PromoteSubscriptionButton } from '../promotional/PromoteSubscriptionButton.jsx';
import { GroceryEmptyContent } from './GroceryEmptyContent.jsx';
import { GroceryListCategory } from './categories/GroceryListCategory.js';
import {
	DESKTOP_DRAG_ACTIVATION_DELAY,
	MOBILE_DRAG_ACTIVATION_DELAY,
} from './constants.js';
import { GroceryDnDDrag, GroceryDnDDrop } from './dndTypes.js';
import {
	useItemsGroupedAndSorted,
	useTransitionPurchasedItems,
} from './hooks.js';
import { GroceryItemDragPreview } from './items/GroceryItemDragPreview.jsx';
import { groceriesState } from './state.js';
import { AutoRestoreScroll } from '@/components/nav/AutoRestoreScroll.jsx';

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

		useTransitionPurchasedItems();

		return (
			<DndContext
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDragOver={handleDragOver}
				onDragCancel={handleDragCancel}
				sensors={sensors}
				modifiers={[snapCenterToCursor]}
			>
				<OnboardingBanner onboarding={firstTimeOnboarding} step="welcome">
					<H3>Welcome to Gnocchi!</H3>
					<P>
						This is your grocery list. Add items by typing in the box above.
					</P>
					<P>Give it a shot! What do you want to be eating soon?</P>
				</OnboardingBanner>
				<OnboardingBanner onboarding={saveHubRecipeOnboarding} step="subscribe">
					<H3>Upgrade for sync and more</H3>
					<P>Sync between devices and other members of your household,</P>
					<P>collaborate in real time while shopping or cooking,</P>
					<P>and make copies of recipes from anywhere on the web.</P>
					<div className="flex flex-row">
						<PromoteSubscriptionButton>Upgrade now</PromoteSubscriptionButton>
					</div>
				</OnboardingBanner>
				<GroceryListCategories {...rest} ref={ref} />
				<GroceryListDragOverlay />
				<AutoRestoreScroll id="groceriesList" debug />
			</DndContext>
		);
	},
);

export default GroceryList;

const GroceryListCategories = forwardRef<
	HTMLDivElement,
	{ className?: string }
>(function GroceryListCategories(props, ref) {
	const listId = useListId();
	const { categoryGroups, itemCount } = useItemsGroupedAndSorted(listId);

	if (itemCount === 0) {
		return <GroceryEmptyContent />;
	}

	return (
		<div
			id="groceryList"
			className="flex flex-col w-full flex-grow-1 p-2 mb-20"
			ref={ref}
			{...props}
		>
			{categoryGroups.map(({ category, items }, i) => {
				return (
					<MemoizedCategory
						key={category?.get('id') || 'null'}
						items={items}
						category={category}
						first={i === 0}
					/>
				);
			})}
		</div>
	);
});

function GroceryListDragOverlay() {
	const [draggingItem, setDraggingItem] = useState<Item | null>(null);
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
			{draggingItem && <GroceryItemDragPreview item={draggingItem} />}
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
			delay: mobile
				? MOBILE_DRAG_ACTIVATION_DELAY
				: DESKTOP_DRAG_ACTIVATION_DELAY,
			tolerance: 5,
		},
	});
	const touchSensor = useSensor(TouchSensor, {
		activationConstraint: {
			delay: mobile
				? MOBILE_DRAG_ACTIVATION_DELAY
				: DESKTOP_DRAG_ACTIVATION_DELAY,
			tolerance: 5,
		},
	});
	const keyboardSensor = useSensor(KeyboardSensor);
	return useSensors(mouseSensor, touchSensor, keyboardSensor);
}

function useOnDragStart() {
	return useCallback(({ active }: DragStartEvent) => {
		const item = (active.data.current as GroceryDnDDrag).value;
		groceriesState.draggedItemOriginalCategory = item.get('categoryId');
		groceriesState.isAnyItemDragged = true;
		navigator.vibrate?.(100);
	}, []);
}

function useOnDragEnd() {
	const setItemCategory = hooks.useSetItemCategory();
	const deleteItem = hooks.useDeleteItem();

	return useCallback(
		async ({ over, active }: DragEndEvent) => {
			const item = (active.data.current as GroceryDnDDrag).value;

			if (!over) {
				// they dropped on nothing... cancel any movement
				item.set('categoryId', groceriesState.draggedItemOriginalCategory);
			} else {
				const dropZone = over.data.current as GroceryDnDDrop;
				if (dropZone.type === 'category') {
					await setItemCategory(item, dropZone.value, true);
				} else if (dropZone.type === 'new') {
					groceriesState.newCategoryPendingItem = valtioRef(item);
				} else if (dropZone.type === 'delete') {
					await deleteItem(item);
				}
			}
			groceriesState.draggedItemOriginalCategory = null;
			groceriesState.isAnyItemDragged = false;
		},
		[setItemCategory, deleteItem],
	);
}

function useOnDragOver() {
	return useCallback(async ({ over, active }: DragOverEvent) => {
		// if (!over) return;
		// const item = (active.data.current as GroceryDnDDrag).value;
		// const dropZone = over.data.current as GroceryDnDDrop;
		// if (dropZone.type === 'category') {
		// 	if (item.get('categoryId') !== dropZone.value) {
		// 		await groceries.setItemCategory(item, dropZone.value);
		// 	}
		// }
	}, []);
}

function useOnDragCancel() {
	return useCallback(({ active }: DragCancelEvent) => {
		if (active) {
			const dragged = active.data.current as GroceryDnDDrag;
			dragged.value.set(
				'categoryId',
				groceriesState.draggedItemOriginalCategory,
			);
		}
	}, []);
}
