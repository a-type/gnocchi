import React, { useMemo, useState } from 'react';
import {
	Button,
	Form,
	SubmitButton,
	TextField,
} from '@/components/primitives/index.js';
import { groceries, hooks } from '@/stores/groceries/index.js';
import { DragHandleDots2Icon, TrashIcon } from '@radix-ui/react-icons';
import { DndContext, DragOverlay, useDndMonitor } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { generateKeyBetween } from 'fractional-indexing';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { createPortal } from 'react-dom';
import { Box } from '@/components/primitives/box/Box.jsx';
import { Formik } from 'formik';
import { Category } from '@aglio/groceries-client';

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
			<Box direction="column" gap={3}>
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
				<AddCategoryForm />
			</Box>
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

	return (
		<Box flexDirection="row" align="center" gap={3} width="full" {...nodeProps}>
			<DragHandleDots2Icon {...handleProps} style={{ touchAction: 'none' }} />
			<Box flexGrow={1}>{category.get('name')}</Box>
			<Button
				color="ghostDestructive"
				onClick={() => {
					const ok = confirm('Delete category ' + category.get('name') + '?');
					if (ok) {
						groceries.deleteCategory(category.get('id'));
					}
				}}
			>
				<TrashIcon />
			</Button>
		</Box>
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
	return (
		<Formik
			initialValues={{ name: '' }}
			onSubmit={(values, bag) => {
				groceries.createCategory(values.name);
				bag.resetForm();
			}}
		>
			<Form>
				<TextField name="name" label="Name" required />
				<SubmitButton>Add</SubmitButton>
			</Form>
		</Formik>
	);
}
