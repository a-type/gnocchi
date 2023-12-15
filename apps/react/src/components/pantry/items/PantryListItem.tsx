import { FoodName } from '@/components/foods/FoodName.jsx';
import { OpenFoodDetailButton } from '@/components/foods/OpenFoodDetailButton.jsx';
import { groceriesState } from '@/components/groceries/state.js';
import { Icon } from '@/components/icons/Icon.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Food } from '@aglio/groceries-client';
import { shortenTimeUnits } from '@aglio/tools';
import { Button } from '@a-type/ui/components/button';
import {
	CardActions,
	CardFooter,
	CardMain,
	CardRoot,
	CardTitle,
} from '@a-type/ui/components/card';
import { Chip } from '@a-type/ui/components/chip';
import { RelativeTime } from '@a-type/ui/components/relativeTime';
import { TextSkeleton } from '@a-type/ui/components/skeletons';
import { Tooltip } from '@a-type/ui/components/tooltip';
import {
	ClockIcon,
	ExclamationTriangleIcon,
	OpenInNewWindowIcon,
	PlusIcon,
	TrashIcon,
} from '@radix-ui/react-icons';
import classNames from 'classnames';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { Suspense, useCallback } from 'react';
import { useExpiresText } from '../hooks.js';

export interface PantryListItemProps {
	item: Food;
	showLabels?: boolean;
	snoozable?: boolean;
}

export function PantryListItem({
	item,
	showLabels = false,
	snoozable,
	...rest
}: PantryListItemProps) {
	const {
		lastPurchasedAt: purchasedAt,
		canonicalName: food,
		expiresAt,
		frozenAt,
	} = hooks.useWatch(item);

	const clearItem = hooks.useClearPantryItem();
	const clear = () => {
		clearItem(item);
	};

	// within 3 days
	const isAlmostOrExpired =
		expiresAt && expiresAt < Date.now() + 1000 * 60 * 60 * 24 * 3;

	const expiresAtText = useExpiresText(item);

	const snooze = useCallback(() => {
		item.set('expiresAt', Date.now() + 6 * 24 * 60 * 60 * 1000);
	}, [item]);

	return (
		<Suspense>
			<CardRoot
				{...rest}
				className={classNames(frozenAt ? 'border-accent-dark' : '')}
			>
				<CardMain compact asChild className="bg-gray-1">
					<OpenFoodDetailButton
						foodName={food}
						className="font-normal border-none rounded-none items-start text-sm"
					>
						<div className="flex flex-row gap-1 items-center flex-wrap p-1 text-xs italic">
							{purchasedAt && (
								<Tooltip disabled={!expiresAt} content={expiresAtText}>
									<Chip
										className={classNames({
											'important:color-attentionDark': isAlmostOrExpired,
										})}
									>
										{isAlmostOrExpired ? (
											<ExclamationTriangleIcon />
										) : (
											<Icon name="clock" />
										)}
										<RelativeTime value={purchasedAt} abbreviate />
									</Chip>
								</Tooltip>
							)}
							{purchasedAt && isAlmostOrExpired && !frozenAt && (
								<Chip>
									<ClockIcon />
									Added <RelativeTime value={purchasedAt} abbreviate />
								</Chip>
							)}
							{frozenAt && (
								<Tooltip content="You marked this item as frozen">
									<Chip color="accent">
										<Icon name="snowflake" />
										<RelativeTime value={frozenAt} abbreviate />
									</Chip>
								</Tooltip>
							)}
						</div>
						<CardTitle className={classNames('text-wrap', 'text-md')}>
							<FoodName food={item} capitalize />
						</CardTitle>
						<OpenInNewWindowIcon className="absolute right-2 top-2 z-1 color-gray-9 opacity-50" />
					</OpenFoodDetailButton>
				</CardMain>
				<CardFooter>
					<CardActions className="flex-wrap">
						<Suspense fallback={<Button size="icon" color="default" />}>
							<QuickAddButton food={item} showLabel={showLabels} />
						</Suspense>
						{snoozable && expiresAt && (
							<Button
								size={showLabels ? 'small' : 'icon'}
								color="ghost"
								onClick={snooze}
							>
								<Icon name="clock" />
								{showLabels && <span className="font-normal">Snooze</span>}
							</Button>
						)}
						{!!purchasedAt && (
							<Button
								size={showLabels ? 'small' : 'icon'}
								color="ghostDestructive"
								onClick={clear}
							>
								<TrashIcon />
								{showLabels && <span className="font-normal">Used</span>}
							</Button>
						)}
						{!!purchasedAt && (
							<FreezeButton food={item} showLabel={showLabels} />
						)}
					</CardActions>
				</CardFooter>
			</CardRoot>
		</Suspense>
	);
}

export const PantryListItemSkeleton = ({
	showLabels,
}: {
	showLabels?: boolean;
}) => {
	return (
		<CardRoot>
			<CardMain compact>
				<CardTitle>
					<TextSkeleton maxLength={12} />
				</CardTitle>
			</CardMain>
			<CardFooter>
				<CardActions>
					<Button size={showLabels ? 'small' : 'icon'} color="default">
						<Icon name="plus" />
						{showLabels && <TextSkeleton maxLength={8} />}
					</Button>
				</CardActions>
			</CardFooter>
		</CardRoot>
	);
};

const QuickAddButton = ({
	food,
	showLabel,
}: {
	food: Food;
	showLabel: boolean;
}) => {
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
			size={showLabel ? 'small' : 'icon'}
			color="default"
			onClick={repurchaseItem}
			disabled={isOnList}
		>
			{isOnList ? <Icon name="check" /> : <Icon name="plus" />}
			{showLabel && <span className="font-normal">Buy again</span>}
		</Button>
	);
};

const FreezeButton = ({
	food,
	showLabel,
}: {
	food: Food;
	showLabel: boolean;
}) => {
	const { frozenAt } = hooks.useWatch(food);

	if (frozenAt) {
		return null;
	}

	return (
		<Tooltip content="Mark as frozen" disabled={showLabel}>
			<Button
				size={showLabel ? 'small' : 'icon'}
				color={frozenAt ? 'accent' : 'ghost'}
				onClick={() => {
					food.update({
						frozenAt: Date.now(),
						expiresAt: null,
					});
				}}
			>
				<Icon name="snowflake" />
				{showLabel && <span className="font-normal">Frozen</span>}
			</Button>
		</Tooltip>
	);
};
