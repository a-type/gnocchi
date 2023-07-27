import { FoodName, LookupFoodName } from '@/components/foods/FoodName.jsx';
import { Icon } from '@/components/icons/Icon.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Food, Item } from '@aglio/groceries-client';
import { Button } from '@aglio/ui/components/button';
import { H2 } from '@aglio/ui/components/typography';
import {
	ClockIcon,
	ExclamationTriangleIcon,
	OpenInNewWindowIcon,
	PlusIcon,
	TrashIcon,
} from '@radix-ui/react-icons';
import classNames from 'classnames';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import { useCallback } from 'react';
import { useExpiresSoonItems, useExpiresText } from '../hooks.js';
import { groceriesState } from '@/components/groceries/state.js';
import { OpenFoodDetailButton } from '@/components/foods/OpenFoodDetailButton.jsx';
import {
	CardActions,
	CardFooter,
	CardMain,
	CardRoot,
	CardTitle,
} from '@aglio/ui/components/card';
import { RelativeTime } from '@aglio/ui/components/relativeTime';

export interface ExpiresSoonSectionProps {
	className?: string;
}

export function ExpiresSoonSection({ className }: ExpiresSoonSectionProps) {
	const expiresSoonItems = useExpiresSoonItems();

	if (expiresSoonItems.length === 0) return null;

	return (
		<div className={classNames('flex flex-col mb-6', className)}>
			<H2 className="important:text-md gutter-bottom ml-3">Expiring soon</H2>
			<div className="flex flex-col gap-3">
				{expiresSoonItems.map((item) => (
					<ExpiresSoonItem item={item} key={item.get('canonicalName')} />
				))}
			</div>
		</div>
	);
}

function ExpiresSoonItem({ item }: { item: Food }) {
	const { canonicalName: food, lastPurchasedAt: purchasedAt } =
		hooks.useWatch(item);
	const addItems = hooks.useAddItems();

	const resetItem = hooks.useClearPantryItem();
	const deleteThisItem = useCallback(() => {
		return resetItem(item);
	}, [resetItem, item]);

	const repurchaseItem = useCallback(async () => {
		await addItems([item.get('canonicalName')]);
		deleteThisItem();
		groceriesState.justAddedSomething = true;
	}, [deleteThisItem, addItems, item]);

	const snooze = useCallback(() => {
		item.set('expiresAt', Date.now() + 6 * 24 * 60 * 60 * 1000);
	}, [item]);

	const expiresAtText = useExpiresText(item, true);

	if (!expiresAtText) return null;

	return (
		<CardRoot>
			<CardMain compact asChild>
				<OpenFoodDetailButton
					foodName={food}
					className="font-normal border-none rounded-none items-start text-sm"
				>
					<div className="flex flex-row items-center gap-1 flex-wrap">
						<div
							className={classNames(
								'color-attentionDark italic text-xs flex flex-row items-center gap-2 whitespace-nowrap bg-white rounded-full border border-solid border-gray-5 m-1 px-2 py-1',
							)}
						>
							<ExclamationTriangleIcon />
							{expiresAtText}
						</div>
						{purchasedAt && (
							<div
								className={classNames(
									'color-gray-7 italic text-xs flex flex-row items-center gap-2 whitespace-nowrap bg-white rounded-full border border-solid border-gray-5 m-1 px-2 py-1',
								)}
							>
								<ClockIcon />
								Added <RelativeTime value={purchasedAt} abbreviate />
								&nbsp;ago
							</div>
						)}
					</div>
					<CardTitle>
						<FoodName food={item} capitalize />
					</CardTitle>
					<OpenInNewWindowIcon className="absolute right-2 top-2 z-1 color-gray-5 bg-white" />
				</OpenFoodDetailButton>
			</CardMain>
			<CardFooter>
				<CardActions>
					<Button size="small" color="default" onClick={repurchaseItem}>
						<PlusIcon />
						<span>Buy again</span>
					</Button>
					<Button
						size="small"
						color="ghostDestructive"
						onClick={deleteThisItem}
					>
						<TrashIcon />
						<span>Used</span>
					</Button>
					<Button size="small" color="ghost" onClick={snooze}>
						<ClockIcon />
						<span>Snooze</span>
					</Button>
				</CardActions>
			</CardFooter>
		</CardRoot>
	);
}
