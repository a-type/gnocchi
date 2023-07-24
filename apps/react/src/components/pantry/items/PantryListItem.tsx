import { FoodName } from '@/components/foods/FoodName.jsx';
import { OpenFoodDetailButton } from '@/components/foods/OpenFoodDetailButton.jsx';
import { groceriesState } from '@/components/groceries/state.js';
import { hooks } from '@/stores/groceries/index.js';
import { Food } from '@aglio/groceries-client';
import { shortenTimeUnits } from '@aglio/tools';
import { Button } from '@aglio/ui/components/button';
import {
	CardActions,
	CardFooter,
	CardMain,
	CardRoot,
	CardTitle,
} from '@aglio/ui/components/card';
import { RelativeTime } from '@aglio/ui/components/relativeTime';
import { TextSkeleton } from '@aglio/ui/components/skeletons';
import { Tooltip } from '@aglio/ui/components/tooltip';
import {
	CheckIcon,
	ClockIcon,
	OpenInNewWindowIcon,
	PlusIcon,
	TrashIcon,
} from '@radix-ui/react-icons';
import classNames from 'classnames';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { Suspense, useCallback } from 'react';

export interface PantryListItemProps {
	item: Food;
}

export function PantryListItem({ item, ...rest }: PantryListItemProps) {
	const {
		lastPurchasedAt: purchasedAt,
		canonicalName: food,
		expiresAt,
	} = hooks.useWatch(item);

	const clear = hooks.useClearPantryItem(item);

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
		expiresAtText += shortenTimeUnits(
			formatDistanceStrict(expiresAt, purchasedAt, {
				addSuffix: true,
			}),
		);
	}

	return (
		<Suspense>
			<CardRoot {...rest}>
				<CardMain compact asChild>
					<OpenFoodDetailButton
						foodName={food}
						className="font-normal border-none rounded-none items-start text-sm"
					>
						{purchasedAt && (
							<Tooltip disabled={!expiresAt} content={expiresAtText}>
								<div
									className={classNames(
										'color-gray7 italic text-xs flex flex-row items-center gap-2 whitespace-nowrap bg-white rounded-full border border-solid border-gray-3 m-1 px-2 py-1',
										{
											'color-attentionDark': isAlmostOrExpired,
										},
									)}
								>
									<ClockIcon />
									<RelativeTime value={purchasedAt} abbreviate />
									&nbsp;ago
								</div>
							</Tooltip>
						)}
						<CardTitle className="text-sm">
							<FoodName food={item} capitalize />
						</CardTitle>
						<OpenInNewWindowIcon className="absolute right-2 top-2 z-1 color-gray-5 bg-white" />
					</OpenFoodDetailButton>
				</CardMain>
				<CardFooter>
					<CardActions>
						<Suspense fallback={<Button size="icon" color="default" />}>
							<QuickAddButton food={item} />
						</Suspense>
						{!!purchasedAt && (
							<Button size="icon" color="ghostDestructive" onClick={clear}>
								<TrashIcon />
							</Button>
						)}
					</CardActions>
				</CardFooter>
			</CardRoot>
		</Suspense>
	);
}

export const PantryListItemSkeleton = () => {
	return (
		<CardRoot>
			<CardMain compact>
				<CardTitle>
					<TextSkeleton maxLength={12} />
				</CardTitle>
			</CardMain>
			<CardFooter>
				<CardActions>
					<Button size="icon" color="default">
						<PlusIcon />
					</Button>
				</CardActions>
			</CardFooter>
		</CardRoot>
	);
};

const QuickAddButton = ({ food }: { food: Food }) => {
	const { canonicalName: foodName } = hooks.useWatch(food);

	const addItems = hooks.useAddItems();

	const repurchaseItem = useCallback(async () => {
		addItems([food.get('canonicalName')], {
			listId: food.get('defaultListId') || null,
		});
		groceriesState.justAddedSomething = true;
	}, [addItems, food]);

	const matchingItem = hooks.useOneItem({
		index: {
			where: 'purchased_food_listId',
			match: {
				purchased: 'no',
				food: foodName,
			},
			order: 'asc',
		},
	});
	const isOnList = !!matchingItem;

	return (
		<Button
			size="icon"
			color="default"
			onClick={repurchaseItem}
			disabled={isOnList}
		>
			{isOnList ? <CheckIcon /> : <PlusIcon />}
		</Button>
	);
};
