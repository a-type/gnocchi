import cuid from 'cuid';
import { forwardRef } from 'react';
import { parseIngredient } from '../../lib/conversion/parseIngredient';
import { groceriesStore } from '../../lib/stores/groceries';

export interface GroceryListAddProps {
	className?: string;
}

export const GroceryListAdd = forwardRef<HTMLFormElement, GroceryListAddProps>(
	function GroceryListAdd({ ...rest }, ref) {
		return (
			<form
				ref={ref}
				{...rest}
				onSubmit={(ev) => {
					ev.preventDefault();
					const text = (
						(ev.target as HTMLFormElement).elements.namedItem(
							'text',
						) as HTMLInputElement
					).value;

					const parsed = parseIngredient(text);
					// find an item that matches the name
					const match = groceriesStore.items.find(
						(item) => item.name === parsed.food,
					);
					if (match) {
						// add the quantity to the existing item
						match.totalQuantity += parsed.quantity;
						match.mergedEntries.push({
							text,
						});
					} else {
						// create a new item
						groceriesStore.items.push({
							id: cuid(),
							createdAt: Date.now(),
							category: 'none',
							name: parsed.food,
							unit: parsed.unit,
							totalQuantity: parsed.quantity,
							purchasedQuantity: 0,
							mergedEntries: [{ text }],
						});
					}
				}}
			>
				<input type="text" name="text" />
				<button type="submit">Add</button>
			</form>
		);
	},
);
