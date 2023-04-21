import { FoodDetailDialog } from '@/components/foods/FoodDetailDialog.jsx';
import { LookupFoodName } from '@/components/foods/FoodName.jsx';
import { Icon } from '@/components/icons/Icon.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Item } from '@aglio/groceries-client';
import { Button } from '@aglio/ui/components/button';
import { H2 } from '@aglio/ui/components/typography';
import { ClockIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import { useCallback } from 'react';
import { useExpiresSoonItems } from '../hooks.js';
import * as classes from './ExpiresSoonSection.css.js';
import { groceriesState } from '@/components/groceries/state.js';

export interface ExpiresSoonSectionProps {
	className?: string;
}

export function ExpiresSoonSection({ className }: ExpiresSoonSectionProps) {
	const expiresSoonItems = useExpiresSoonItems();

	if (expiresSoonItems.length === 0) return null;

	return (
		<div className={classes.root}>
			<H2 gutterBottom>Expiring Soon</H2>
			<div className={classNames(classes.list, className)}>
				{expiresSoonItems.map((item) => (
					<ExpiresSoonItem item={item} key={item.get('id')} />
				))}
			</div>
		</div>
	);
}

function ExpiresSoonItem({ item }: { item: Item }) {
	const { food, expiresAt, purchasedAt } = hooks.useWatch(item);
	const deleteItem = hooks.useDeleteItem();
	const cloneItem = hooks.useCloneItem();

	const deleteThisItem = useCallback(() => {
		deleteItem(item);
	}, [item, deleteItem]);

	const repurchaseItem = useCallback(async () => {
		await cloneItem(item);
		deleteThisItem();
		groceriesState.justAddedSomething = true;
	}, [deleteThisItem, cloneItem, item]);

	const snooze = useCallback(() => {
		item.set('expiresAt', Date.now() + 6 * 24 * 60 * 60 * 1000);
	}, [item]);

	if (!expiresAt) return null;

	const inThePast = expiresAt < Date.now();

	return (
		<div className={classes.item}>
			<div className={classes.itemContent}>
				<div className={classes.itemText}>
					<LookupFoodName foodName={food} />
				</div>
				<div className={classes.dateStack}>
					<div className={classes.expiresAt}>
						{inThePast ? 'Expired' : 'Expires'}{' '}
						{formatDistanceToNowStrict(expiresAt, { addSuffix: true })}
					</div>
					{purchasedAt && (
						<div className={classes.purchasedAt}>
							Purchased{' '}
							{formatDistanceToNowStrict(purchasedAt, { addSuffix: true })}
						</div>
					)}
				</div>
			</div>
			<div className={classes.itemActions}>
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
				<FoodDetailDialog foodName={food}>
					<Button color="ghost" size="icon" className={classes.itemFoodInfo}>
						<Icon name="food" />
					</Button>
				</FoodDetailDialog>
			</div>
		</div>
	);
}
