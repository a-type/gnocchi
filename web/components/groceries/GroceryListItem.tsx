import { forwardRef } from 'react';
import { useSnapshot } from 'valtio';
import { GroceryItemData } from '../../lib/stores/groceries';
import pluralize from 'pluralize';

export interface GroceryListItemProps {
	className?: string;
	item: GroceryItemData;
}

export const GroceryListItem = forwardRef<HTMLDivElement, GroceryListItemProps>(
	function GroceryListItem({ item, ...rest }, ref) {
		const state = useSnapshot(item);

		const isPurchased = state.purchasedQuantity >= state.totalQuantity;
		const pluralizedUnit = state.unit
			? state.totalQuantity === 1
				? state.unit
				: pluralize(state.unit)
			: '';
		const pluralizedName =
			state.totalQuantity === 1 ? state.name : pluralize(state.name);
		const displayString =
			state.mergedEntries.length === 1
				? state.mergedEntries[0].text
				: `${state.totalQuantity} ${
						pluralizedUnit && `${pluralizedUnit} `
				  }${pluralizedName}`;

		return (
			<div>
				<input
					type="checkbox"
					checked={isPurchased}
					onChange={() => {
						if (isPurchased) {
							item.purchasedQuantity = 0;
						} else {
							item.purchasedQuantity = state.totalQuantity;
						}
					}}
				/>
				<span>{displayString}</span>
			</div>
		);
	},
);
