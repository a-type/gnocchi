import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import { Suspense, useState } from 'react';
import { RecipeTagsList } from '../collection/RecipeTagsList.jsx';
import { NewTagForm } from './NewTagForm.jsx';
import { Icon } from '@/components/icons/Icon.jsx';
import { ThemeName } from '@aglio/ui/components/colorPicker';
import {
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverTrigger,
} from '@aglio/ui/components/popover';
import { Button } from '@aglio/ui/components/button';
import { H2 } from '@aglio/ui/components/typography';
import { RecipeAddTag } from '@/components/recipes/editor/RecipeAddTag.jsx';

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
		<div className={classNames('flex flex-col gap-2', className)}>
			<div className="flex flex-wrap gap-1 p-1 items-center">
				{tags?.map((tag) => (
					<Suspense key={tag}>
						<TagDisplay key={tag} tag={tag} onRemove={removeTag} />
					</Suspense>
				))}
				<RecipeAddTag recipe={recipe} empty={tags?.length === 0} />
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
		<div
			className={classNames(
				'flex items-center gap-1 px-2 pl-4 rounded-full bg-primaryLight color-black font-bold text-sm',
				color && `theme-${color}`,
			)}
		>
			<span>{icon ?? <Icon name="tag" />}</span>
			<span>{tag}</span>
			<Button size="icon" color="ghost" onClick={() => onRemove(tag)}>
				<Cross2Icon />
			</Button>
		</div>
	);
}
