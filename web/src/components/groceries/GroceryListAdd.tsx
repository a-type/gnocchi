import { Form, Box, TextField, SubmitButton } from 'components/primitives';
import React, { forwardRef, useRef, useCallback, useEffect } from 'react';
import { parseIngredient } from 'lib/conversion/parseIngredient';
import { Formik } from 'formik';
import { useGroceryList, useGroceryListCtx } from 'contexts/GroceryListContext';
import { useQuery } from '@aphro/react';
import { commit, P, UpdateType } from '@aphro/runtime-ts';
import GroceryItemMutations from 'stores/groceries/.generated/GroceryItemMutations';
import GroceryInputMutations from 'stores/groceries/.generated/GroceryInputMutations';
import GroceryCategory from 'stores/groceries/.generated/GroceryCategory';
import GroceryFoodCategoryLookup from 'stores/groceries/.generated/GroceryFoodCategoryLookup';
import { EMPTY_CATEGORY_NAME } from 'stores/groceries/constants';
import GroceryCategoryMutations from 'stores/groceries/.generated/GroceryCategoryMutations';
import { generateKeyBetween } from 'fractional-indexing';
import GroceryItem from 'stores/groceries/.generated/GroceryItem';

export interface GroceryListAddProps {
	className?: string;
}

export const GroceryListAdd = forwardRef<HTMLFormElement, GroceryListAddProps>(
	function GroceryListAdd({ ...rest }, ref) {
		const inputRef = useRef<HTMLInputElement>(null);
		const list = useGroceryList();
		const ctx = useGroceryListCtx();
		const { data: items } = useQuery(() => list.queryItems(), []);

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
				onSubmit={async ({ text }, { resetForm }) => {
					const parsed = parseIngredient(text);
					// find an item that matches the name
					const match = items.find((item) => item.name === parsed.food);
					if (match) {
						// add the quantity to the existing item
						commit(ctx, [
							GroceryItemMutations.setTotalQuantity(match, {
								totalQuantity: match.totalQuantity + parsed.quantity,
							}).toChangeset(),
							GroceryInputMutations.create(ctx, {
								itemId: match.id,
								text,
							}).toChangeset(),
						]);
					} else {
						// lookup the category
						// const category =
						// 	categoryLookupStore.table[parsed.food] || NONE_CATEGORY;
						// TODO: lookup category
						const matchingCategoryLookup = await GroceryFoodCategoryLookup.gen(
							ctx,
							parsed.food as any,
						);
						let matchingCategoryId = matchingCategoryLookup?.categoryId;
						if (!matchingCategoryId) {
							const defaultCategory = await GroceryCategory.queryAll(ctx)
								.whereName(P.equals(EMPTY_CATEGORY_NAME))
								.genOnlyValue();
							matchingCategoryId = defaultCategory?.id;
						}
						if (!matchingCategoryId) {
							// there is no empty category?? create one...
							const newCategory = await GroceryCategoryMutations.create(ctx, {
								name: EMPTY_CATEGORY_NAME,
							}).save();
							matchingCategoryId = newCategory.id;
						}

						const lastCategoryItem = await GroceryItem.queryAll(ctx)
							.whereCategoryId(P.equals(matchingCategoryId!))
							.orderBySortKey('desc')
							.take(1)
							.genOnlyValue();

						// create a new item
						const item = await GroceryItemMutations.create(ctx, {
							name: parsed.food,
							totalQuantity: parsed.quantity,
							unit: parsed.unit || '',
							categoryId: matchingCategoryId!,
							listId: list.id,
							purchasedQuantity: 0,
							createdAt: Date.now(),
							sortKey: generateKeyBetween(
								lastCategoryItem?.sortKey ?? null,
								null,
							),
						}).save();
						GroceryInputMutations.create(ctx, {
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
							autoComplete="off"
							placeholder="Add an item..."
						/>
						<SubmitButton>Add</SubmitButton>
					</Box>
				</Form>
			</Formik>
		);
	},
);
