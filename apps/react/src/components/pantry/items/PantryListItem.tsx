import { groceries, Item } from '@/stores/groceries/index.js';
import * as groceryItemClasses from '@/components/groceries/items/GroceryListItem.css.js';
import { useItemDisplayText } from '@/components/groceries/items/hooks.js';
import { Button } from '@/components/primitives/primitives.jsx';
import { TrashIcon } from '@radix-ui/react-icons';

export interface PantryListItemProps {
	item: Item;
}

export function PantryListItem({ item, ...rest }: PantryListItemProps) {
	const displayText = useItemDisplayText(item);

	const deleteItem = () => {
		groceries.deleteItem(item);
	};

	return (
		<div className={groceryItemClasses.root} {...rest}>
			<div className={groceryItemClasses.mainContent}>
				<Button size="small" color="ghostDestructive" onClick={deleteItem}>
					<TrashIcon />
				</Button>
				<div className={groceryItemClasses.textContent}>{displayText}</div>
			</div>
		</div>
	);
}
