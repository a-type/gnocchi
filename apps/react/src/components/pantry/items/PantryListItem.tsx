import { groceries, hooks } from '@/stores/groceries/index.js';
import * as groceryItemClasses from '@/components/groceries/items/GroceryListItem.css.js';
import { useItemDisplayText } from '@/components/groceries/items/hooks.js';
import { Button, Tooltip } from '@aglio/ui';
import { ClockIcon, TrashIcon } from '@radix-ui/react-icons';
import { RelativeTime } from '@aglio/ui';
import { clsx } from 'clsx';
import * as classes from './PantryListItem.css.js';
import { Item } from '@aglio/groceries-client';
import classNames from 'classnames';
import { FoodDetailDialog } from '@/components/foods/FoodDetailDialog.jsx';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';

export interface PantryListItemProps {
	item: Item;
}

export function PantryListItem({ item, ...rest }: PantryListItemProps) {
	const { id, purchasedAt, food, expiresAt } = hooks.useWatch(item);

	const deleteItem = () => {
		groceries.deleteItem(item);
	};

	// within 3 days
	const isAlmostOrExpired =
		expiresAt && expiresAt < Date.now() + 1000 * 60 * 60 * 24 * 3;

	let expiresAtText = '';
	if (expiresAt) {
		if (expiresAt && expiresAt < Date.now()) {
			expiresAtText = 'Expired ';
		} else {
			expiresAtText = 'Expires ';
		}
		expiresAtText += formatDistanceToNowStrict(expiresAt, { addSuffix: true });
	}

	return (
		<div className={groceryItemClasses.root} data-id={id} {...rest}>
			<div
				className={classNames(
					groceryItemClasses.mainContent,
					classes.mainContent,
				)}
			>
				<Button size="small" color="ghostDestructive" onClick={deleteItem}>
					<TrashIcon />
				</Button>
				<div className={groceryItemClasses.textContent}>{food}</div>
				{purchasedAt && (
					<Tooltip disabled={!expiresAt} content={expiresAtText}>
						<div
							className={classNames(classes.purchasedAt, {
								[classes.expiredWarning]: isAlmostOrExpired,
							})}
						>
							<ClockIcon />
							<RelativeTime value={purchasedAt} />
							&nbsp;ago
						</div>
					</Tooltip>
				)}
				<FoodDetailDialog foodName={food} />
			</div>
		</div>
	);
}
