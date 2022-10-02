import React from 'react';
import { Box, Button } from '@/components/primitives/primitives.js';
import { groceries, GroceryCategory, hooks } from '@/stores/groceries/index.js';
import { TrashIcon } from '@radix-ui/react-icons';

export interface CategoryManagerProps {}

export function CategoryManager({}: CategoryManagerProps) {
	const categories = hooks.useAllCategories();

	return (
		<Box direction="column" gap={3}>
			{categories.map((category) => (
				<CategoryManagerItem key={category.id} category={category} />
			))}
		</Box>
	);
}

function CategoryManagerItem({ category }: { category: GroceryCategory }) {
	hooks.useWatch(category);

	return (
		<Box direction="row" gap={3}>
			<Box flex={1}>{category.name}</Box>
			<Button
				color="ghost"
				onClick={() => {
					groceries.deleteCategory(category.id);
				}}
			>
				<TrashIcon />
			</Button>
		</Box>
	);
}
