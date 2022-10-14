import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RowSpacingIcon } from '@radix-ui/react-icons';
import { styled } from '@/stitches.config.js';
import * as g from '@use-gesture/react';
import {
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverTrigger,
} from '../../primitives/Popover.js';
import { PopoverAnchor } from '@radix-ui/react-popover';
import { animated, SpringValue, useSpring } from '@react-spring/web';
import {
	groceries,
	GroceryCategory,
	GroceryItem,
	hooks,
} from '@/stores/groceries/index.js';
import { useAnimationFrame } from '@/hooks/useAnimationFrame.js';
import { Dialog, DialogContent } from '@/components/primitives/Dialog.js';
import { NewCategoryForm } from '../NewCategoryForm.js';
import { Button } from '@/components/primitives/primitives.js';
import {
	DropdownMenu,
	DropdownMenuArrow,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/primitives/DropdownMenu.js';

const SCROLL_DEADZONE = 20;
const SCROLL_MAX = 100;
const SCROLL_MULTIPLIER = 0.5;
const ITEM_HEIGHT = 32;

function scrollPositionToCategory(
	scrollPosition: number,
	categories: GroceryCategory[],
) {
	const totalWrapHeight = (categories.length + 1) * ITEM_HEIGHT;
	let adjustedScrollPosition = scrollPosition;
	// add total list length to value until it's positive
	while (adjustedScrollPosition < 0) {
		adjustedScrollPosition += totalWrapHeight;
	}
	let rawIndex = Math.floor(adjustedScrollPosition / ITEM_HEIGHT);
	// the item at categories.length is "New Category"
	// after that it wraps around
	const realIndex = rawIndex % (categories.length + 1);
	if (realIndex >= categories.length) {
		return 'new';
	}
	return categories[realIndex].get('id');
}

export function CategoryPicker({ item }: { item: GroceryItem }) {
	hooks.useWatch(item);
	const [state, setState] = useState<
		'idle' | 'scrubbing' | 'picking' | 'create'
	>('idle');

	const categories = hooks.useAllCategories();
	const itemCategoryIndex = categories.findIndex(
		(category) => category.get('id') === item.get('categoryId'),
	);

	const setCategory = useCallback(
		(categoryId: string) => {
			groceries.setItemCategory(item, categoryId);
		},
		[item],
	);

	const onCreateCategory = (category: GroceryCategory) => {
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
	onCreate: (category: GroceryCategory) => void;
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
