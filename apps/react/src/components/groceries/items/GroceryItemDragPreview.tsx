import { Item } from '@aglio/groceries-client';
import { container, root } from './GroceryItemDragPreview.css.js';
import { useItemDisplayText } from './hooks.js';

export interface GroceryItemDragPreviewProps {
	item: Item;
}

export function GroceryItemDragPreview({ item }: GroceryItemDragPreviewProps) {
	const display = useItemDisplayText(item);
	return (
		<div className={root}>
			<div className={container}>{display}</div>
		</div>
	);
}
