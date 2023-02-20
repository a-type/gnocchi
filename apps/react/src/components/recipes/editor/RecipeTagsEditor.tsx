import { TagIcon } from '@/components/icons/TagIcon.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import {
	Box,
	Button,
	H2,
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverTrigger,
	themeMap,
	ThemeName,
} from '@aglio/ui';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import classnames from 'classnames';
import { Suspense, useState } from 'react';
import { RecipeTagsList } from '../collection/RecipeTagsList.jsx';
import { NewTagForm } from './NewTagForm.jsx';
import * as classes from './RecipeTagsEditor.css.js';

export interface RecipeTagsEditorProps {
	recipe: Recipe;
	className?: string;
}

// shows a list of applied tags with X buttons and a dropdown at the end
// which allows you to add a new tag
export function RecipeTagsEditor({ recipe, className }: RecipeTagsEditorProps) {
	const { tags } = hooks.useWatch(recipe);
	hooks.useWatch(tags);
	const removeTag = (name: string) => tags.removeAll(name);

	return (
		<div className={classnames(classes.root, className)}>
			<H2>Tags</H2>
			<div className={classes.list}>
				{tags?.map((tag) => (
					<Suspense key={tag}>
						<TagDisplay key={tag} tag={tag} onRemove={removeTag} />
					</Suspense>
				))}
				<TagAdd recipe={recipe} empty={tags?.length === 0} />
			</div>
		</div>
	);
}

function TagDisplay({
	tag,
	onRemove,
}: {
	tag: string;
	onRemove: (name: string) => void;
}) {
	const data = hooks.useRecipeTagMetadata(tag);
	hooks.useWatch(data);
	const icon = data?.get('icon');
	const color = data?.get('color') as ThemeName | undefined;

	return (
		<div className={classnames(classes.tag, color && themeMap[color])}>
			<span>{icon ?? <TagIcon />}</span>
			<span>{tag}</span>
			<Button
				size="small"
				color="ghost"
				className={classes.tagRemoveButton}
				onClick={() => onRemove(tag)}
			>
				<Cross2Icon />
			</Button>
		</div>
	);
}

function TagAdd({
	recipe,
	onAdd,
	empty,
}: {
	recipe: Recipe;
	onAdd?: () => void;
	empty?: boolean;
}) {
	const [open, setOpen] = useState(false);
	const addTag = (tagName: string | null) => {
		if (tagName === null) return;
		recipe.get('tags').add(tagName);
		onAdd?.();
		setOpen(false);
	};
	const { tags } = hooks.useWatch(recipe);
	hooks.useWatch(tags);
	const tagsSnapshot = tags?.getSnapshot() ?? [];

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button size="small">
					<PlusIcon />
					{empty && <span>Add tag</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className={classes.popover}>
				<PopoverArrow />
				<Suspense>
					<NewTagForm onCreate={addTag} />
					<Box mt={4}>
						<RecipeTagsList onSelect={addTag} omit={tagsSnapshot} />
					</Box>
				</Suspense>
			</PopoverContent>
		</Popover>
	);
}
