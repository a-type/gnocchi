import {
	Button,
	Form,
	Input,
	Box,
	TextField,
	SubmitButton,
} from 'components/primitives';
import React, { forwardRef, useRef, useCallback, useEffect } from 'react';
import { parseIngredient } from 'lib/conversion/parseIngredient';
import { Formik } from 'formik';
import { useGroceryList, useGroceryListCtx } from 'contexts/GroceryListContext';
import { unwraps, useQuery } from '@aphro/react';
import { commit, UpdateType } from '@aphro/runtime-ts';
import GroceryItemMutations from 'stores/groceries/.generated/GroceryItemMutations';
import GroceryInputMutations from 'stores/groceries/.generated/GroceryInputMutations';
import GroceryCategory from 'stores/groceries/.generated/GroceryCategory';

export interface GroceryListAddProps {
	className?: string;
}

export const GroceryListAdd = forwardRef<HTMLFormElement, GroceryListAddProps>(
	function GroceryListAdd({ ...rest }, ref) {
		const inputRef = useRef<HTMLInputElement>(null);
		const list = useGroceryList();
		const ctx = useGroceryListCtx();
		const [categories] = unwraps(
			useQuery(
				UpdateType.CREATE_OR_DELETE,
				() => GroceryCategory.queryAll(ctx),
				[],
			),
		);
		const [items] = unwraps(
			useQuery(UpdateType.CREATE_OR_UPDATE, () => list.queryItems(), []),
		);

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
					const match = items.find((item) => item.name === parsed.food);
					if (match) {
						// add the quantity to the existing item
						commit(list.ctx, [
							GroceryItemMutations.setTotalQuantity(match, {
								totalQuantity: match.totalQuantity + parsed.quantity,
							}).toChangeset(),
							GroceryInputMutations.create(list.ctx, {
								itemId: match.id,
								text,
							}).toChangeset(),
						]);
					} else {
						// lookup the category
						// const category =
						// 	categoryLookupStore.table[parsed.food] || NONE_CATEGORY;
						// TODO: lookup category

						// create a new item
						const [_, item] = GroceryItemMutations.create(list.ctx, {
							name: parsed.food,
							totalQuantity: parsed.quantity,
							unit: parsed.unit || '',
							categoryId: categories[0]!.id,
							listId: list.id,
							purchasedQuantity: 0,
							createdAt: Date.now(),
						}).save();
						GroceryInputMutations.create(list.ctx, {
							itemId: item.id,
							text,
						}).save();
					}
					resetForm();

					// focus the input
					inputRef.current?.focus();
				}}
			>
				<Form ref={ref} css={{ width: '$full' }} {...rest}>
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
