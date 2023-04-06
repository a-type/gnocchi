import { FoodDetailDialog } from '@/components/foods/FoodDetailDialog.jsx';
import * as groceryItemClasses from '@/components/groceries/items/GroceryListItem.css.js';
import { hooks } from '@/stores/groceries/index.js';
import { Item } from '@aglio/groceries-client';
import { RelativeTime } from '@aglio/ui/components/relativeTime';
import { ClockIcon, TrashIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import * as classes from './PantryListItem.css.js';
import { Button } from '@aglio/ui/components/button';
import { Tooltip } from '@aglio/ui/components/tooltip';
import { FoodName } from '@/components/foods/FoodName.jsx';

export interface PantryListItemProps {
	item: Item;
}

export function PantryListItem({ item, ...rest }: PantryListItemProps) {
	const { id, purchasedAt, food, expiresAt } = hooks.useWatch(item);
	const deleteItem = hooks.useDeleteItem();

	// within 3 days
	const isAlmostOrExpired =
		expiresAt && expiresAt < Date.now() + 1000 * 60 * 60 * 24 * 3;

	let expiresAtText = '';
	if (expiresAt && purchasedAt) {
		if (expiresAt && expiresAt < Date.now()) {
			expiresAtText = 'Expired ';
		} else {
			expiresAtText = 'Expires ';
		}
		expiresAtText += formatDistanceStrict(expiresAt, purchasedAt, {
			addSuffix: true,
		});
	}

	return (
		<div className={groceryItemClasses.root} data-id={id} {...rest}>
			<div
				className={classNames(
					groceryItemClasses.mainContent,
					classes.mainContent,
				)}
			>
				<Button
					size="small"
					color="ghostDestructive"
					onClick={() => deleteItem(item)}
				>
					<TrashIcon />
				</Button>
				<div className={groceryItemClasses.textContent}>
					<PantryFoodName food={food} />
				</div>
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

function PantryFoodName({ food }: { food: string }) {
	const metadata = hooks.useOneFood({
		index: {
			where: 'nameLookup',
			equals: food.toLowerCase(),
		},
	});

	if (!metadata) {
		return <>{food}</>;
	}

	return <FoodName food={metadata} />;
}
