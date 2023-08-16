import { hooks } from '@/stores/groceries/index.js';
import { Category } from '@aglio/groceries-client';
import { ReactNode, useCallback, useState } from 'react';
import { NewCategoryForm } from '../NewCategoryForm.js';
import { Button } from '@aglio/ui/components/button';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogSelectItem,
	DialogSelectList,
	DialogSelectTrigger,
} from '@aglio/ui/components/dialog';
import { withSuspense } from '../../../hocs/withSuspense.jsx';

export const CategorySelect = withSuspense(function CategorySelect({
	value,
	onChange,
	children,
}: {
	value: string | null;
	onChange: (v: string | null) => void;
	children?: ReactNode;
}) {
	const [open, onOpenChange] = useState(false);
	const [state, setState] = useState<'idle' | 'create'>('idle');

	const categories = hooks.useAllCategories({
		index: {
			where: 'sortKey',
			order: 'asc',
		},
	});

	const selectCategory = useCallback(
		(incomingValue: string | null) => {
			const realValue = incomingValue === 'null' ? null : incomingValue;
			if (realValue === value) return;

			if (realValue === null) {
				onChange(null);
			} else if (realValue === 'new') {
				setState('create');
			} else {
				onChange(realValue);
			}
			// onOpenChange(false);
		},
		[onChange, onOpenChange],
	);

	const onCreateCategory = (category: Category) => {
		selectCategory(category?.get('id'));
		setState('idle');
	};

	const category = categories.find((c) => c.get('id') === value) ?? null;

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogSelectTrigger asChild={!!children}>
					{children || category?.get('name') || 'Uncategorized'}
				</DialogSelectTrigger>
				<DialogContent>
					<DialogSelectList
						className="mb-4"
						value={value || 'null'}
						onValueChange={selectCategory}
					>
						{categories.map((category) => (
							<DialogSelectItem
								key={category.get('id')}
								value={category.get('id')}
							>
								{category.get('name')}
							</DialogSelectItem>
						))}
						<DialogSelectItem value="null">Uncategorized</DialogSelectItem>
					</DialogSelectList>

					<DialogActions className="justify-between">
						<Button color="primary" onClick={() => setState('create')}>
							New category
						</Button>
						<DialogClose asChild>
							<Button>Close</Button>
						</DialogClose>
					</DialogActions>
				</DialogContent>
			</Dialog>
			<CreateCategory
				onCreate={onCreateCategory}
				open={state === 'create'}
				onOpenChange={(v) => {
					if (!v) setState('idle');
				}}
			/>
		</>
	);
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
