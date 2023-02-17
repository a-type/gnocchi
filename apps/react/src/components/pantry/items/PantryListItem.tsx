import { groceries, hooks } from '@/stores/groceries/index.js';
import * as groceryItemClasses from '@/components/groceries/items/GroceryListItem.css.js';
import { useItemDisplayText } from '@/components/groceries/items/hooks.js';
import { Button } from '@aglio/ui';
import { ClockIcon, TrashIcon } from '@radix-ui/react-icons';
import { RelativeTime } from '@aglio/ui';
import { clsx } from 'clsx';
import * as classes from './PantryListItem.css.js';
import { Item } from '@aglio/groceries-client';
import classNames from 'classnames';

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
			<div
				className={classNames(
					groceryItemClasses.mainContent,
					classes.mainContent,
				)}
			>
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
