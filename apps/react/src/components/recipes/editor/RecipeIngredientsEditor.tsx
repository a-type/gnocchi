import { Form, SubmitButton, TextAreaField } from '@aglio/ui';
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
import { DragHandleDots2Icon, TrashIcon } from '@radix-ui/react-icons';
import { Formik } from 'formik';
import * as classes from './RecipeIngredientsEditor.css.js';
import { NoteEditor } from './NoteEditor.jsx';
import { Icon } from '@/components/icons/Icon.jsx';

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

	return (
		<div
			ref={setNodeRef}
			className={classes.item}
			{...attributes}
			style={style}
		>
			<div className={classes.itemMainLine}>
				<DragHandleDots2Icon className={classes.dragHandle} {...listeners} />

				<span className={classes.itemText}>{ingredient.get('text')}</span>
				<Button color="ghost" onClick={addNote}>
					<Icon name="add_note" />
				</Button>
				<Button color="ghostDestructive" onClick={onDelete}>
					<TrashIcon />
				</Button>
			</div>
			<IngredientNote ingredient={ingredient} />
		</div>
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
