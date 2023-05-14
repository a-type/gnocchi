import { Item } from '@aglio/groceries-client';
import { useItemDisplayText } from './hooks.js';

export interface GroceryItemDragPreviewProps {
	item: Item;
}

export function GroceryItemDragPreview({ item }: GroceryItemDragPreviewProps) {
	const display = useItemDisplayText(item);
	return (
		<div className="flex flex-row items-center justify-center pointer-events-none relative w-32px h-32px">
			<div className="absolute left-[calc(50%-32px)] translate-x--100% p-3 rounded-lg bg-white border-default whitespace-nowrap shadow-lg select-none pointer-events-none">
				{display}
			</div>
		</div>
	);
}
