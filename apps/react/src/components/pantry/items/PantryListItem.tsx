import { FoodDetailDialog } from '@/components/foods/FoodDetailDialog.jsx';
import { LookupFoodName } from '@/components/foods/FoodName.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Item } from '@aglio/groceries-client';
import { Button } from '@aglio/ui/components/button';
import { RelativeTime } from '@aglio/ui/components/relativeTime';
import { Tooltip } from '@aglio/ui/components/tooltip';
import {
	CheckIcon,
	ClockIcon,
	PlusIcon,
	TrashIcon,
} from '@radix-ui/react-icons';
import classNames from 'classnames';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { useCallback, useState } from 'react';
import { groceriesState } from '@/components/groceries/state.js';
import { TextSkeleton } from '@aglio/ui/components/skeletons';
import { shortenTimeUnits } from '@aglio/tools';
import { withClassName } from '@aglio/ui/hooks';

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
		expiresAtText += shortenTimeUnits(
			formatDistanceStrict(expiresAt, purchasedAt, {
				addSuffix: true,
			}),
		);
	}

	const [wasRepurchased, setWasRepurchased] = useState(false);
	const cloneItem = hooks.useCloneItem();
	const repurchaseItem = useCallback(async () => {
		await cloneItem(item);
		groceriesState.justAddedSomething = true;
		setWasRepurchased(true);
	}, [cloneItem, item]);

	return (
		<Root data-id={id} {...rest}>
			<Main>
				<Button
					size="icon"
					color="destructive"
					onClick={() => deleteItem(item)}
				>
					<TrashIcon />
				</Button>
				<Button
					size="icon"
					color="default"
					onClick={repurchaseItem}
					disabled={wasRepurchased}
				>
					{wasRepurchased ? <CheckIcon /> : <PlusIcon />}
				</Button>
				<TextContent>
					<LookupFoodName foodName={food} />
				</TextContent>
				{purchasedAt && (
					<Tooltip disabled={!expiresAt} content={expiresAtText}>
						<div
							className={classNames(
								'justify-self-end ml-auto color-gray5 italic text-sm flex flex-row items-center gap-2 whitespace-nowrap',
								{
									'color-attentionDark': isAlmostOrExpired,
								},
							)}
						>
							<ClockIcon />
							<RelativeTime value={purchasedAt} />
							&nbsp;ago
						</div>
					</Tooltip>
				)}
				<FoodDetailDialog foodName={food} />
			</Main>
		</Root>
	);
}

const Root = withClassName(
	'div',
	'w-full bg-wash rounded-md relative select-none all:transition-200 all:ease-springy repeated:mt-1',
);
const Main = withClassName(
	'div',
	'flex flex-row items-start gap-2 pt-4 pr-3 pb-2 relative pl-2',
);
const TextContent = withClassName(
	'div',
	'flex flex-row gap-1 max-w-full overflow-hidden text-ellipsis relative',
);

export const PantryListItemSkeleton = () => {
	return (
		<Root>
			<Main>
				<Button size="icon" color="destructive" disabled>
					<TrashIcon />
				</Button>
				<Button size="icon" color="default" disabled>
					<PlusIcon />
				</Button>
				<TextContent>
					<TextSkeleton maxLength={16} />
				</TextContent>
			</Main>
		</Root>
	);
};
