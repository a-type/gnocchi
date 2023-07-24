import { LookupFoodName } from '@/components/foods/FoodName.jsx';
import { Icon } from '@/components/icons/Icon.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Food, Item } from '@aglio/groceries-client';
import { Button } from '@aglio/ui/components/button';
import { H2 } from '@aglio/ui/components/typography';
import { ClockIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import { useCallback } from 'react';
import { useExpiresSoonItems } from '../hooks.js';
import { groceriesState } from '@/components/groceries/state.js';
import { OpenFoodDetailButton } from '@/components/foods/OpenFoodDetailButton.jsx';

export interface ExpiresSoonSectionProps {
	className?: string;
}

export function ExpiresSoonSection({ className }: ExpiresSoonSectionProps) {
	const expiresSoonItems = useExpiresSoonItems();

	if (expiresSoonItems.length === 0) return null;

	return (
		<div className={classNames('flex flex-col mb-6', className)}>
			<H2 className="important:text-md gutter-bottom">Expiring soon</H2>
			<div className="flex flex-col gap-3">
				{expiresSoonItems.map((item) => (
					<ExpiresSoonItem item={item} key={item.get('canonicalName')} />
				))}
			</div>
		</div>
	);
}

function ExpiresSoonItem({ item }: { item: Food }) {
	const {
		canonicalName: food,
		expiresAt,
		lastPurchasedAt: purchasedAt,
	} = hooks.useWatch(item);
	const deleteItem = hooks.useDeleteItem();
	const addItems = hooks.useAddItems();

	const deleteThisItem = useCallback(() => {
		item.set('lastPurchasedAt', null);
		item.set('expiresAt', null);
	}, [item, deleteItem]);

	const repurchaseItem = useCallback(async () => {
		await addItems([item.get('canonicalName')]);
		deleteThisItem();
		groceriesState.justAddedSomething = true;
	}, [deleteThisItem, addItems, item]);

	const snooze = useCallback(() => {
		item.set('expiresAt', Date.now() + 6 * 24 * 60 * 60 * 1000);
	}, [item]);

	if (!expiresAt) return null;

	const inThePast = expiresAt < Date.now();

	return (
		<div className="flex flex-col gap-2 p-3 rounded-lg bg-white border-light">
			<div className="flex flex-row items-start gap-2">
				<div className="flex-1 text-md">
					<LookupFoodName foodName={food} />
				</div>
				<div className="flex flex-col gap-1 text-xs">
					<div className="ml-auto color-attentionDark">
						{inThePast ? 'Expired' : 'Expires'}{' '}
						{formatDistanceToNowStrict(expiresAt, { addSuffix: true })}
					</div>
					{purchasedAt && (
						<div className="color-gray8">
							Purchased{' '}
							{formatDistanceToNowStrict(purchasedAt, { addSuffix: true })}
						</div>
					)}
				</div>
			</div>
			<div className="flex flex-row items-center w-full gap-2 flex-wrap">
				<Button size="small" color="destructive" onClick={deleteThisItem}>
					<TrashIcon />
					<span>Delete</span>
				</Button>
				<Button size="small" color="default" onClick={repurchaseItem}>
					<PlusIcon />
					<span>Add to list</span>
				</Button>
				<Button size="small" color="ghost" onClick={snooze}>
					<ClockIcon />
					<span>Snooze</span>
				</Button>
				<OpenFoodDetailButton foodName={food} className="ml-auto" />
			</div>
		</div>
	);
}
