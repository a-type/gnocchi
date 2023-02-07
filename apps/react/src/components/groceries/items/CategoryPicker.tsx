import { Dialog, DialogContent } from '@aglio/ui';
import { Button } from '@aglio/ui';
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from '@aglio/ui';
import { groceries, hooks } from '@/stores/groceries/index.js';
import { Category, Item } from '@aglio/groceries-client';
import { RowSpacingIcon } from '@radix-ui/react-icons';
import { Suspense, useCallback, useState } from 'react';
import { NewCategoryForm } from '../NewCategoryForm.js';
import { groceriesState } from '../state.js';

export function CategoryPicker({ item }: { item: Item }) {
	const { categoryId } = hooks.useWatch(item);
	const [state, setState] = useState<
		'idle' | 'scrubbing' | 'picking' | 'create'
	>('idle');

	const setCategory = useCallback(
		(value: string) => {
			const realValue = value === 'null' ? null : value;
			if (realValue === item.get('categoryId')) return;

			if (realValue === null) {
				groceries.setItemCategory(item, null, false);
				groceriesState.justMovedItemId = item.get('id');
			} else if (realValue === 'new') {
				setState('create');
			} else {
				groceries.setItemCategory(item, realValue, true);
				groceriesState.justMovedItemId = item.get('id');
			}
		},
		[item],
	);

	const onCreateCategory = (category: Category) => {
		groceries.setItemCategory(item, category?.get('id'));
		setState('idle');
	};

	return (
		<>
			<Select
				value={categoryId === null ? 'null' : categoryId}
				onValueChange={setCategory}
			>
				<SelectTrigger asChild>
					<Button color="ghost">
						<SelectValue asChild>
							<RowSpacingIcon />
						</SelectValue>
					</Button>
				</SelectTrigger>
				<SelectContent>
					<Suspense>
						<CategoryList />
					</Suspense>
					<SelectItem value="null">Uncategorized</SelectItem>
					<SelectItem value="new">Create new category</SelectItem>
				</SelectContent>
			</Select>
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

function CategoryList() {
	const categories = hooks.useAllCategories({
		index: {
			where: 'sortKey',
			order: 'asc',
		},
	});

	return (
		<>
			{categories.map((category, index) => (
				<SelectItem key={category.get('id')} value={category.get('id')}>
					{category.get('name')}
				</SelectItem>
			))}
		</>
	);
}

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
