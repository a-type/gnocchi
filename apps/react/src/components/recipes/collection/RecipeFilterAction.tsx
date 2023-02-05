import { FilterIcon } from '@/components/icons/FilterIcon.jsx';
import { ActionButton } from '@/components/primitives/actions/ActionButton.jsx';
import {
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverTrigger,
	ThemeName,
} from '@/components/primitives/index.js';
import { hooks } from '@/stores/groceries/index.js';
import { themeMap } from '@/styles/themes/map.js';
import classNames from 'classnames';
import { forwardRef, Suspense, useState } from 'react';
import { useRecipeTagFilter } from './hooks.js';
import * as classes from './RecipeFilterAction.css.js';
import { RecipeTagsList } from './RecipeTagsList.jsx';

export interface RecipeFilterActionProps {}

export function RecipeFilterAction({}: RecipeFilterActionProps) {
	const [open, setOpen] = useState(false);
	const [tagFilter, setTagFilter] = useRecipeTagFilter();

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
							setTagFilter(tag);
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
		const [tagFilter, setTagFilter] = useRecipeTagFilter();
		const selectedTag = hooks.useRecipeTagMetadata(tagFilter!, {
			skip: !tagFilter,
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
					setTagFilter(null);
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
