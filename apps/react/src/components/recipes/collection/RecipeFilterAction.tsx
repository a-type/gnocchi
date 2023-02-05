import { FilterIcon } from '@/components/icons/FilterIcon.jsx';
import { TagIcon } from '@/components/icons/TagIcon.jsx';
import { ActionButton } from '@/components/primitives/actions/ActionButton.jsx';
import {
	Button,
	ButtonProps,
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverTrigger,
	ThemeName,
} from '@/components/primitives/index.js';
import { hooks } from '@/stores/groceries/index.js';
import { themeMap } from '@/styles/themes/map.js';
import { RecipeTagMetadata } from '@aglio/groceries-client';
import classNames from 'classnames';
import { forwardRef, Suspense, useState } from 'react';
import { useSnapshot } from 'valtio';
import * as classes from './RecipeFilterAction.css.js';
import { RecipeTagsList } from './RecipeTagsList.jsx';
import { recipesCollectionState } from './state.js';

export interface RecipeFilterActionProps {}

export function RecipeFilterAction({}: RecipeFilterActionProps) {
	const [open, setOpen] = useState(false);
	const tagFilter = useSnapshot(recipesCollectionState).tagFilter;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<Suspense>
				<PopoverTrigger asChild>
					<SelectedTagDisplay />
				</PopoverTrigger>
			</Suspense>
			<PopoverContent containerClassName={classes.popoverContainer}>
				<PopoverArrow />
				<Suspense>
					<RecipeTagsList
						showNone
						selectedValue={tagFilter}
						onSelect={(tag) => {
							recipesCollectionState.tagFilter = tag;
							setOpen(false);
						}}
					/>
				</Suspense>
			</PopoverContent>
		</Popover>
	);
}

const SelectedTagDisplay = forwardRef<HTMLButtonElement, any>(
	function SelectedTagDisplay(props, ref) {
		const selectedTagName = useSnapshot(recipesCollectionState).tagFilter;
		const selectedTag = hooks.useRecipeTagMetadata(selectedTagName!, {
			skip: !selectedTagName,
		});

		if (!selectedTag) {
			return (
				<ActionButton
					{...props}
					color="default"
					ref={ref}
					icon={<FilterIcon />}
				>
					Filter
				</ActionButton>
			);
		}

		return (
			<ActionButton
				color="primary"
				{...props}
				icon={selectedTag.get('icon') ?? <FilterIcon />}
				onClick={() => {
					recipesCollectionState.tagFilter = null;
				}}
				ref={ref}
				className={classNames(
					classes.button,
					selectedTag.get('color') &&
						themeMap[selectedTag.get('color') as ThemeName],
				)}
			>
				{selectedTag.get('name')}
			</ActionButton>
		);
	},
);
