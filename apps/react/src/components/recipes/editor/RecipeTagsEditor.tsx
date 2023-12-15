import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import { Suspense, useState } from 'react';
import { RecipeTagsList } from '../collection/RecipeTagsList.jsx';
import { NewTagForm } from './NewTagForm.jsx';
import { Icon } from '@/components/icons/Icon.jsx';
import { ThemeName } from '@a-type/ui/components/colorPicker';
import {
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverTrigger,
} from '@a-type/ui/components/popover';
import { Button } from '@a-type/ui/components/button';
import { H2 } from '@a-type/ui/components/typography';
import { RecipeAddTag } from '@/components/recipes/editor/RecipeAddTag.jsx';
import { Chip } from '@a-type/ui/components/chip';

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
		<div className={classNames('flex flex-wrap gap-1 items-center')}>
			{tags?.map((tag) => (
				<Suspense key={tag}>
					<TagDisplay key={tag} tag={tag} onRemove={removeTag} />
				</Suspense>
			))}
			<RecipeAddTag
				recipe={recipe}
				empty={tags?.length === 0}
				className="text-xs"
			/>
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
		<Chip
			color="primary"
			className={classNames(
				'flex items-center gap-1 px-2 rounded-full bg-primaryLight color-black font-bold text-xs',
				color && `theme-${color}`,
			)}
		>
			<span>{icon ?? <Icon name="tag" className="w-[10px] h-[10px]" />}</span>
			<span>{tag}</span>
			<Button
				size="icon"
				color="ghost"
				className="p-0"
				onClick={() => onRemove(tag)}
			>
				<Cross2Icon className="w-[10px] h-[10px]" />
			</Button>
		</Chip>
	);
}
