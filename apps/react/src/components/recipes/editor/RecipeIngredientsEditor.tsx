import {
	Box,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuItemIndicator,
	DropdownMenuTrigger,
	Form,
	DropdownMenuItemRightSlot,
	SubmitButton,
	TextAreaField,
	TextField,
} from '@aglio/ui';
import { Button } from '@aglio/ui';
import { hooks } from '@/stores/groceries/index.js';
import * as mutations from '@/stores/groceries/recipeMutations.js';
import {
	Recipe,
	RecipeIngredients,
	RecipeIngredientsItem,
} from '@aglio/groceries-client';
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
	CheckIcon,
	DotsVerticalIcon,
	DragHandleDots2Icon,
	TrashIcon,
} from '@radix-ui/react-icons';
import { Formik } from 'formik';
import * as classes from './RecipeIngredientsEditor.css.js';
import { NoteEditor } from './NoteEditor.jsx';
import { Icon } from '@/components/icons/Icon.jsx';
import { useState } from 'react';
import classNames from 'classnames';

export interface RecipeIngredientsEditorProps {
	recipe: Recipe;
}

export function RecipeIngredientsEditor({
	recipe,
}: RecipeIngredientsEditorProps) {
	const { ingredients } = hooks.useWatch(recipe);
	hooks.useWatch(ingredients);
	const ids = ingredients.map((ingredient) => ingredient.get('id'));

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	return (
		<div className={classes.listContainer}>
			<DndContext
				sensors={sensors}
				onDragEnd={({ active, over }) => {
					if (active?.id && over?.id && active.id !== over.id) {
						const oldIndex = ids.indexOf(active.id as string);
						const newIndex = ids.indexOf(over.id as string);
						ingredients.move(oldIndex, newIndex);
					}
				}}
			>
				<SortableContext items={ids} strategy={verticalListSortingStrategy}>
					<div className={classes.list}>
						{ingredients
							.filter((i) => !!i)
							.map((ingredient, index) => (
								<RecipeIngredientItem
									key={ingredient.get('id')}
									ingredient={ingredient}
									onDelete={() => {
										ingredients.delete(index);
									}}
								/>
							))}
					</div>
				</SortableContext>
			</DndContext>
			<AddIngredientsForm ingredients={ingredients} />
		</div>
	);
}

function RecipeIngredientItem({
	ingredient,
	onDelete,
}: {
	ingredient: RecipeIngredientsItem;
	onDelete: () => void;
}) {
	const { setNodeRef, attributes, listeners, transform, transition } =
		useSortable({
			id: ingredient.get('id'),
		});

	const addNote = () => {
		ingredient.set('note', '');
	};

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const { text, isSectionHeader } = hooks.useWatch(ingredient);

	return (
		<div
			ref={setNodeRef}
			className={classes.item}
			{...attributes}
			style={style}
		>
			<div className={classes.itemMainLine}>
				<DragHandleDots2Icon className={classes.dragHandle} {...listeners} />

				<span
					className={classNames(
						classes.itemText,
						isSectionHeader && classes.itemHeader,
					)}
				>
					{text}
				</span>
				<Box direction="row" gap={1} alignItems="center">
					<Button color="ghost" onClick={addNote}>
						<Icon name="add_note" />
					</Button>
					<IngredientMenu ingredient={ingredient} onDelete={onDelete} />
				</Box>
			</div>
			<IngredientNote ingredient={ingredient} />
		</div>
	);
}

function IngredientMenu({
	ingredient,
	onDelete,
}: {
	ingredient: RecipeIngredientsItem;
	onDelete: () => void;
}) {
	const { isSectionHeader } = hooks.useWatch(ingredient);
	const [detailsOpen, setDetailsOpen] = useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon" color="ghost">
						<DotsVerticalIcon />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuCheckboxItem
						checked={isSectionHeader}
						onCheckedChange={(v) => ingredient.set('isSectionHeader', !!v)}
					>
						<DropdownMenuItemIndicator>
							<CheckIcon />
						</DropdownMenuItemIndicator>
						Section header
					</DropdownMenuCheckboxItem>
					<DropdownMenuItem onSelect={() => setDetailsOpen(true)}>
						Edit details
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={onDelete} color="destructive">
						<span>Delete</span>
						<DropdownMenuItemRightSlot>
							<TrashIcon />
						</DropdownMenuItemRightSlot>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<IngredientDetailsDialog
				ingredient={ingredient}
				open={detailsOpen}
				onOpenChange={setDetailsOpen}
			/>
		</>
	);
}

function IngredientDetailsDialog({
	ingredient,
	...rest
}: {
	ingredient: RecipeIngredientsItem;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	return (
		<Dialog {...rest}>
			<DialogContent>
				<Formik
					initialValues={{
						text: ingredient.get('text'),
						food: ingredient.get('food') || '',
						quantity: `${ingredient.get('quantity')}`,
						unit: ingredient.get('unit') || '',
					}}
					onSubmit={(values, bag) => {
						let quantity: number | undefined = parseFloat(values.quantity);
						if (isNaN(quantity)) {
							quantity = undefined;
						}
						ingredient.update({
							text: values.text,
							food: values.food?.toLocaleLowerCase() || undefined,
							quantity,
							unit: values.unit || undefined,
						});
						bag.setSubmitting(false);
						rest.onOpenChange?.(false);
					}}
				>
					<Form>
						<TextField name="text" label="Text" />
						<TextField name="food" label="Food" />
						<TextField name="quantity" label="Quantity" type="number" />
						<TextField name="unit" label="Unit" />
						<DialogActions>
							<DialogClose asChild>
								<Button>Cancel</Button>
							</DialogClose>
							<SubmitButton color="primary">Save</SubmitButton>
						</DialogActions>
					</Form>
				</Formik>
			</DialogContent>
		</Dialog>
	);
}

function IngredientNote({ ingredient }: { ingredient: RecipeIngredientsItem }) {
	const { note } = hooks.useWatch(ingredient);

	if (note === undefined || note === null) return null;

	return (
		<NoteEditor
			value={note}
			onChange={(value) => ingredient.set('note', value)}
		/>
	);
}

function AddIngredientsForm({
	ingredients,
}: {
	ingredients: RecipeIngredients;
}) {
	return (
		<Formik
			initialValues={{ text: '' }}
			onSubmit={async ({ text }, bag) => {
				await mutations.addIngredients(ingredients, text);
				bag.resetForm();
			}}
		>
			<Form>
				<TextAreaField
					name="text"
					required
					placeholder="Add ingredient line(s)"
					autoSize
					padBottomPixels={40}
				/>
				<SubmitButton>Add</SubmitButton>
			</Form>
		</Formik>
	);
}
