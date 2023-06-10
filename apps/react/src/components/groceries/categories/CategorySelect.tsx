import { hooks } from '@/stores/groceries/index.js';
import { Category } from '@aglio/groceries-client';
import { ReactNode, Suspense, useCallback, useState } from 'react';
import { NewCategoryForm } from '../NewCategoryForm.js';
import {
	Select,
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@aglio/ui/components/select';
import { Button } from '@aglio/ui/components/button';
import { Dialog, DialogContent } from '@aglio/ui/components/dialog';

export function CategorySelect({
	value,
	onChange,
	children,
	contentClassName,
	open,
	inDialog,
}: {
	value: string | null;
	onChange: (v: string | null) => void;
	children?: ReactNode;
	contentClassName?: string;
	open?: boolean;
	inDialog?: boolean;
}) {
	const [state, setState] = useState<
		'idle' | 'scrubbing' | 'picking' | 'create'
	>('idle');

	const setCategory = useCallback(
		(incomingValue: string) => {
			const realValue = incomingValue === 'null' ? null : incomingValue;
			if (realValue === value) return;

			if (realValue === null) {
				onChange(null);
			} else if (realValue === 'new') {
				setState('create');
			} else {
				onChange(realValue);
			}
		},
		[onChange],
	);

	const onCreateCategory = (category: Category) => {
		onChange(category?.get('id'));
		setState('idle');
	};

	return (
		<>
			<Select
				value={value === null ? 'null' : value}
				onValueChange={setCategory}
				open={open}
			>
				<SelectTrigger asChild>
					<Button color="ghost">
						<SelectValue asChild={!!children}>{children}</SelectValue>
						{!children ? <SelectIcon /> : undefined}
					</Button>
				</SelectTrigger>
				<SelectContent className={contentClassName} inDialog={inDialog}>
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
