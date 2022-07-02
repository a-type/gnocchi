import { Button, Form, Input, Box, TextField } from 'components/primitives';
import cuid from 'cuid';
import { forwardRef } from 'react';
import { parseIngredient } from 'lib/conversion/parseIngredient';
import { groceriesStore } from 'lib/stores/groceries';
import { Formik } from 'formik';

export interface GroceryListAddProps {
	className?: string;
}

export const GroceryListAdd = forwardRef<HTMLFormElement, GroceryListAddProps>(
	function GroceryListAdd({ ...rest }, ref) {
		return (
			<Formik
				initialValues={{ text: '' }}
				onSubmit={({ text }, { resetForm }) => {
					const parsed = parseIngredient(text);
					// find an item that matches the name
					const match = groceriesStore.categories.none.find(
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
						groceriesStore.categories.none.push({
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
					resetForm();
				}}
			>
				<Form ref={ref} css={{ w: '$full' }} {...rest}>
					<Box w="full" direction="row" gap={2}>
						<TextField name="text" required css={{ flex: 1 }} />
						<Button type="submit">Add</Button>
					</Box>
				</Form>
			</Formik>
		);
	},
);
