import { forwardRef, ReactNode } from 'react';
import { useSnapshot } from 'valtio';
import { GroceryItemData } from 'lib/stores/groceries';
import pluralize from 'pluralize';
import { Box } from 'components/primitives';
import { Checkbox, CheckboxIndicator } from 'components/primitives/Checkbox';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { styled } from 'stitches.config';

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
			<ItemContainer {...rest} ref={ref}>
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
					<CheckboxIndicator />
				</Checkbox>
				<span>{displayString}</span>
			</ItemContainer>
		);
	},
);

const ItemContainer = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	gap: '$2',
	backgroundColor: '$white',
	borderRadius: '$md',
	padding: '$3',
});

export function GroceryListItemDraggable({
	item,
	...rest
}: {
	item: GroceryItemData;
	children: ReactNode;
}) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: item.id,
		data: item,
	});

	return (
		<Box
			{...attributes}
			{...listeners}
			ref={setNodeRef}
			style={{
				transform: CSS.Translate.toString(transform),
			}}
			{...rest}
		/>
	);
}
