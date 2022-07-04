import {
	Button,
	Form,
	Input,
	Box,
	TextField,
	SubmitButton,
} from 'components/primitives';
import cuid from 'cuid';
import { forwardRef, useRef, useCallback, useEffect } from 'react';
import { parseIngredient } from 'lib/conversion/parseIngredient';
import {
	categoryLookupStore,
	groceriesStore,
	NONE_CATEGORY,
} from 'lib/stores/groceries';
import { Formik } from 'formik';

export interface GroceryListAddProps {
	className?: string;
}

export const GroceryListAdd = forwardRef<HTMLFormElement, GroceryListAddProps>(
	function GroceryListAdd({ ...rest }, ref) {
		const inputRef = useRef<HTMLInputElement>(null);

		// prevent immediate input focus on touch so the keyboard has
		// time to appear
		const handleInputTouch = useCallback((ev: TouchEvent) => {
			ev.preventDefault();
			setTimeout(() => {
				inputRef.current?.focus();
			}, 300);
		}, []);

		useEffect(() => {
			const input = inputRef.current;
			if (!input) return;
			input.addEventListener('touchstart', handleInputTouch, true);
		}, [handleInputTouch]);

		return (
			<Formik
				initialValues={{ text: '' }}
				onSubmit={({ text }, { resetForm }) => {
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
						// lookup the category
						const category =
							categoryLookupStore.table[parsed.food] || NONE_CATEGORY;
						console.log('lookup category', category);

						// create a new item
						groceriesStore.items.push({
							id: cuid(),
							createdAt: Date.now(),
							category,
							name: parsed.food,
							unit: parsed.unit,
							totalQuantity: parsed.quantity,
							purchasedQuantity: 0,
							mergedEntries: [{ text }],
						});
					}
					resetForm();

					// focus the input
					inputRef.current?.focus();
				}}
			>
				<Form ref={ref} css={{ width: '$full', p: '$2' }} {...rest}>
					<Box w="full" direction="row" gap={2}>
						<TextField
							inputRef={inputRef}
							name="text"
							required
							css={{ flex: 1 }}
						/>
						<SubmitButton>Add</SubmitButton>
					</Box>
				</Form>
			</Formik>
		);
	},
);
