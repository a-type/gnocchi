import { Dialog, DialogContent } from '@/components/primitives/Dialog.js';
import {
	DropdownMenu,
	DropdownMenuArrow,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/primitives/DropdownMenu.js';
import { Button } from '@/components/primitives/primitives.js';
import { styled } from '@/stitches.config.js';
import { groceries, Category, Item, hooks } from '@/stores/groceries/index.js';
import { RowSpacingIcon } from '@radix-ui/react-icons';
import React, { useCallback, useState } from 'react';
import { NewCategoryForm } from '../NewCategoryForm.js';
import { groceriesState } from '../state.js';

const ITEM_HEIGHT = 32;

export function CategoryPicker({ item }: { item: Item }) {
	hooks.useWatch(item);
	const [state, setState] = useState<
		'idle' | 'scrubbing' | 'picking' | 'create'
	>('idle');

	const categories = hooks.useAllCategories();

	const setCategory = useCallback(
		(categoryId: string) => {
			groceries.setItemCategory(item, categoryId);
			groceriesState.justMovedItemId = item.get('id');
		},
		[item],
	);

	const onCreateCategory = (category: Category) => {
		item.set('categoryId', category.get('id'));
		setState('idle');
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button color="ghost">
						<Trigger />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent side="left" sideOffset={2}>
					<DropdownMenuArrow />

					{categories.map((category, index) => (
						<CategoryItem
							key={category.get('id')}
							data-category-index={index}
							onClick={() => setCategory(category.get('id'))}
							selected={category.get('id') === item.get('categoryId')}
						>
							{category.get('name')}
						</CategoryItem>
					))}
					<CategoryItem
						key="new"
						data-category-index={categories.length}
						onClick={() => {
							setState('create');
						}}
						selected={false}
					>
						Create new category
					</CategoryItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<CreateCategory
				onCreate={onCreateCategory}
				open={state === 'create'}
				onOpenChange={(v) => {
					if (!v) setState('idle');
				}}
			/>
		</>
	);
}

const Trigger = styled(RowSpacingIcon, {});

const CategoryItem = styled(DropdownMenuItem, {
	height: ITEM_HEIGHT,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	position: 'relative',
	borderRadius: '$sm',
	padding: '$1 $2',

	transition: 'transform 0.2s ease-out, background-color 0.2s ease-out',

	variants: {
		selected: {
			true: {
				backgroundColor: '$lemonLighter',
				color: '$lemonDarker',
			},
		},
	},
});

function CreateCategory({
	onCreate,
	...rest
}: {
	onCreate: (category: Category) => void;
	open: boolean;
	onOpenChange: (v: boolean) => void;
}) {
	return (
		<Dialog {...rest}>
			<DialogContent>
				<NewCategoryForm onDone={onCreate} autoFocus />
			</DialogContent>
		</Dialog>
	);
}
