import { groceries, hooks } from '@/stores/groceries/index.js';
import { useExpiresSoonItems } from '../hooks.js';
import { Item } from '@aglio/groceries-client';
import classNames from 'classnames';
import * as classes from './ExpiresSoonSection.css.js';
import { Button, H2, RelativeTime } from '@aglio/ui';
import { useCallback } from 'react';
import { FoodDetailDialog } from '@/components/foods/FoodDetailDialog.jsx';
import { FoodIcon } from '@/components/icons/FoodIcon.jsx';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import { ClockIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';

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

	const deleteItem = useCallback(() => {
		groceries.deleteItem(item);
	}, [item]);

	const repurchaseItem = useCallback(async () => {
		await groceries.cloneItem(item);
		deleteItem();
	}, [deleteItem, item]);

	const snooze = useCallback(() => {
		item.set('expiresAt', Date.now() + 6 * 24 * 60 * 60 * 1000);
	}, [item]);

	if (!expiresAt) return null;

	const inThePast = expiresAt < Date.now();

	return (
		<div className={classes.item}>
			<div className={classes.itemContent}>
				<div className={classes.itemText}>{food}</div>
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
				<Button size="small" color="destructive" onClick={deleteItem}>
					<TrashIcon />
					<span>Delete</span>
				</Button>
				<Button size="small" color="default" onClick={repurchaseItem}>
					<PlusIcon />
					<span>Repurchase</span>
				</Button>
				<Button size="small" color="ghost" onClick={snooze}>
					<ClockIcon />
					<span>Snooze</span>
				</Button>
				<FoodDetailDialog foodName={food}>
					<Button color="ghost" size="icon" className={classes.itemFoodInfo}>
						<FoodIcon />
					</Button>
				</FoodDetailDialog>
			</div>
		</div>
	);
}
