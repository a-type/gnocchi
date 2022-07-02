import { forwardRef } from 'react';
import { useSnapshot } from 'valtio';
import { GroceryItemData } from 'lib/stores/groceries';
import pluralize from 'pluralize';
import { Box } from 'components/primitives';
import { Checkbox, CheckboxIndicator } from 'components/primitives/Checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

export interface GroceryListItemProps {
	className?: string;
	item: GroceryItemData;
}

export const GroceryListItem = forwardRef<HTMLDivElement, GroceryListItemProps>(
	function GroceryListItem({ item, ...rest }, ref) {
		const state = useSnapshot(item);

		const isPurchased = state.purchasedQuantity >= state.totalQuantity;
		const isPartiallyPurchased = state.purchasedQuantity > 0;
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
			<Box direction="row" gap={2}>
				<Checkbox
					checked={
						isPurchased ? true : isPartiallyPurchased ? 'indeterminate' : false
					}
					onCheckedChange={(checked) => {
						if (isPurchased) {
							item.purchasedQuantity = 0;
						} else {
							item.purchasedQuantity = state.totalQuantity;
						}
					}}
				>
					<CheckboxIndicator>
						<CheckIcon />
					</CheckboxIndicator>
				</Checkbox>
				<span>{displayString}</span>
			</Box>
		);
	},
);
