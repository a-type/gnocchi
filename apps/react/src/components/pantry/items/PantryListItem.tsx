import { groceries, hooks, Item } from '@/stores/groceries/index.js';
import * as groceryItemClasses from '@/components/groceries/items/GroceryListItem.css.js';
import { useItemDisplayText } from '@/components/groceries/items/hooks.js';
import { Button } from '@/components/primitives/primitives.jsx';
import { TrashIcon } from '@radix-ui/react-icons';
import { RelativeTime } from '@/components/primitives/RelativeTime.jsx';
import { clsx } from 'clsx';
import * as classes from './PantryListItem.css.js';

export interface PantryListItemProps {
	item: Item;
}

export function PantryListItem({ item, ...rest }: PantryListItemProps) {
	const displayText = useItemDisplayText(item);
	const { purchasedAt } = hooks.useWatch(item);

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
				{purchasedAt && (
					<div className={classes.purchasedAt}>
						<span className={classes.wordBought}>bought&nbsp;</span>
						<RelativeTime value={purchasedAt} />
						&nbsp;ago
					</div>
				)}
			</div>
		</div>
	);
}
