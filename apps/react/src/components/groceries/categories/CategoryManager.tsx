import { useMemo, useState } from 'react';
import { hooks } from '@/stores/groceries/index.js';
import { DragHandleDots2Icon, TrashIcon } from '@radix-ui/react-icons';
import { DndContext, DragOverlay, useDndMonitor } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { generateKeyBetween } from 'fractional-indexing';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { createPortal } from 'react-dom';
import { Category } from '@aglio/groceries-client';
import { Button } from '@a-type/ui/components/button';
import {
	Form,
	FormikForm,
	SubmitButton,
	TextField,
} from '@a-type/ui/components/forms';

export interface CategoryManagerProps {}

function getNextAndPrevSortKeys(
	sortKeys: string[],
	reversedSortKeys: string[],
	currentSortKey: string,
) {
	const prev = reversedSortKeys.find((key) => key < currentSortKey);
	const next = sortKeys.find((key) => key > currentSortKey);
	return {
		prev: generateKeyBetween(prev ?? null, currentSortKey),
		next: generateKeyBetween(currentSortKey, next ?? null),
	};
}

interface DragData {
	category: Category;
	prevSortKey: string;
	nextSortKey: string;
}

export function CategoryManager({}: CategoryManagerProps) {
	return (
		<DndContext
			onDragOver={({ active, over }) => {
				if (!over) return;
				if (active.id === over.id) return;
				const dragged = active.data.current as DragData;
				const overed = over.data.current as DragData;
				if (dragged.category.get('sortKey') < overed.category.get('sortKey')) {
					dragged.category.set('sortKey', overed.nextSortKey);
				} else {
					dragged.category.set('sortKey', overed.prevSortKey);
				}
			}}
			modifiers={[restrictToVerticalAxis]}
		>
			<CategoryList />
			<CategoryDragOverlay />
		</DndContext>
	);
}

function CategoryList() {
	const categories = hooks.useAllCategories({
		index: {
			where: 'sortKey',
			order: 'asc',
		},
	});

	const categoryIds = useMemo(
		() => categories.map((cat) => cat.get('id')),
		[categories],
	);
	const categoryKeys = useMemo(() => {
		return categories.map((cat) => cat.get('sortKey'));
	}, [categories]);
	const reversedCategoryKeys = useMemo(() => {
		return [...categoryKeys].reverse();
	}, [categoryKeys]);

	return (
		<SortableContext items={categoryIds}>
			<div className="flex flex-col min-h-0 mb-3 overflow-y-auto">
				{categories.map((category) => {
					const { prev, next } = getNextAndPrevSortKeys(
						categoryKeys,
						reversedCategoryKeys,
						category.get('sortKey'),
					);

					return (
						<SortableCategoryManagerItem
							key={category.get('id')}
							prevSortKey={prev}
							nextSortKey={next}
							category={category}
						/>
					);
				})}
			</div>
			<AddCategoryForm />
		</SortableContext>
	);
}

function CategoryManagerItem({
	category,
	handleProps,
	nodeProps,
}: {
	category: Category;
	handleProps?: any;
	nodeProps?: any;
}) {
	hooks.useWatch(category);
	const deleteCategory = hooks.useDeleteCategory();

	return (
		<div className="flex flex-row items-center gap-3 w-full" {...nodeProps}>
			<DragHandleDots2Icon {...handleProps} style={{ touchAction: 'none' }} />
			<div className="flex-grow-1">{category.get('name')}</div>
			<Button
				color="ghostDestructive"
				onClick={() => {
					const ok = confirm('Delete category ' + category.get('name') + '?');
					if (ok) {
						deleteCategory(category.get('id'));
					}
				}}
			>
				<TrashIcon />
			</Button>
		</div>
	);
}

function SortableCategoryManagerItem({
	category,
	prevSortKey,
	nextSortKey,
}: {
	category: Category;
	nextSortKey: string | null;
	prevSortKey: string | null;
}) {
	const {
		setNodeRef,
		transform,
		transition,
		listeners,
		attributes,
		isDragging,
	} = useSortable({
		id: category.get('id'),
		data: {
			category,
			prevSortKey,
			nextSortKey,
		},
	});

	return (
		<CategoryManagerItem
			category={category}
			nodeProps={{
				ref: setNodeRef,
				...attributes,
				style: {
					transform: CSS.Transform.toString(transform),
					transition,
					opacity: isDragging ? 0 : 1,
				},
			}}
			handleProps={listeners}
		/>
	);
}

function CategoryDragOverlay() {
	const [dragging, setDragging] = useState<Category>();
	useDndMonitor({
		onDragStart({ active }) {
			setDragging(active.data.current?.category);
		},
		onDragCancel() {
			setDragging(undefined);
		},
		onDragEnd() {
			setDragging(undefined);
		},
	});

	return createPortal(
		<DragOverlay style={{ zIndex: 100000 }}>
			{dragging && <CategoryManagerItem category={dragging} />}
		</DragOverlay>,
		document.body,
	);
}

function AddCategoryForm() {
	const createCategory = hooks.useCreateCategory();
	return (
		<FormikForm
			initialValues={{ name: '' }}
			onSubmit={(values, bag) => {
				createCategory(values.name);
				bag.resetForm();
			}}
		>
			<TextField name="name" label="Name" required />
			<SubmitButton>Add</SubmitButton>
		</FormikForm>
	);
}
