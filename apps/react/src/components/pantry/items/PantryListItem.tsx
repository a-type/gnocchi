import { groceries, hooks } from '@/stores/groceries/index.js';
import * as groceryItemClasses from '@/components/groceries/items/GroceryListItem.css.js';
import { useItemDisplayText } from '@/components/groceries/items/hooks.js';
import { Button } from '@/components/primitives/index.js';
import { ClockIcon, TrashIcon } from '@radix-ui/react-icons';
import { RelativeTime } from '@/components/primitives/RelativeTime.jsx';
import { clsx } from 'clsx';
import * as classes from './PantryListItem.css.js';
import { Item } from '@aglio/groceries-client';

export interface PantryListItemProps {
	item: Item;
}

export function PantryListItem({ item, ...rest }: PantryListItemProps) {
	const displayText = useItemDisplayText(item);
	const { purchasedAt, inputs, totalQuantity } = hooks.useWatch(item);

	const deleteItem = () => {
		groceries.deleteItem(item);
	};

	return (
		<div className={groceryItemClasses.root} {...rest}>
			<div className={groceryItemClasses.mainContent}>
				<Button size="small" color="ghostDestructive" onClick={deleteItem}>
					<TrashIcon />
				</Button>
				<div className={groceryItemClasses.textContent}>
					{inputs.length > 1 && <span>{totalQuantity}</span>}
					{displayText}
				</div>
				{purchasedAt && (
					<div className={classes.purchasedAt}>
						<ClockIcon />
						<RelativeTime value={purchasedAt} />
						&nbsp;ago
					</div>
				)}
			</div>
		</div>
	);
}
