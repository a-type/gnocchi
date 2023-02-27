import { groceries, hooks } from '@/stores/groceries/index.js';
import { useExpiresSoonItems } from '../hooks.js';
import { Item } from '@aglio/groceries-client';
import classNames from 'classnames';
import * as classes from './ExpiresSoonSection.css.js';
import { Button, H2, RelativeTime } from '@aglio/ui';
import { useCallback } from 'react';

export interface ExpiresSoonSectionProps {
	className?: string;
}

export function ExpiresSoonSection({ className }: ExpiresSoonSectionProps) {
	const expiresSoonItems = useExpiresSoonItems();

	if (expiresSoonItems.length === 0) return null;

	return (
		<div>
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
	const { food, expiresAt } = hooks.useWatch(item);

	const deleteItem = useCallback(() => {
		groceries.deleteItem(item);
	}, [item]);

	const repurchaseItem = useCallback(async () => {
		await groceries.cloneItem(item);
		deleteItem();
	}, [deleteItem, item]);

	if (!expiresAt) return null;

	return (
		<div className={classes.item}>
			<div className={classes.itemContent}>
				<div className={classes.itemText}>{food}</div>
				<div className={classes.expiresAt}>
					Expires <RelativeTime value={expiresAt} />
				</div>
			</div>
			<div className={classes.itemActions}>
				<Button size="small" color="destructive" onClick={deleteItem}>
					Delete
				</Button>
				<Button size="small" color="default" onClick={repurchaseItem}>
					Repurchase
				</Button>
			</div>
		</div>
	);
}
