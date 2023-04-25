import { Icon } from '@/components/icons/Icon.jsx';
import { RecipeTagMenuWrapper } from '@/components/recipes/tags/RecipeTagMenuWrapper.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Button, ButtonProps } from '@aglio/ui/components/button';
import { ThemeName } from '@aglio/ui/components/colorPicker';
import { themeMap } from '@aglio/ui/styles';
import classNames from 'classnames';
import { forwardRef } from 'react';
import * as classes from './RecipeTagsList.css.js';

export function RecipeTagsList({
	onSelect,
	selectedValue,
	showNone,
	omit,
}: {
	onSelect: (name: string | null) => void;
	selectedValue?: string | null;
	showNone?: boolean;
	omit?: string[];
}) {
	const allTags = hooks.useAllRecipeTagMetadata();
	const filteredByOmit = allTags.filter(
		(tag) => !omit?.includes(tag.get('name')),
	);

	return (
		<div className={classes.tagsList}>
			{showNone && (
				<TagButtonBase
					toggled={!selectedValue}
					onClick={() => {
						onSelect(null);
					}}
				>
					None
				</TagButtonBase>
			)}
			{filteredByOmit.map((tag) => (
				<RecipeTagMenuWrapper tagName={tag.get('name')} key={tag.get('name')}>
					<TagButtonBase
						toggled={tag.get('name') === selectedValue}
						onClick={() => onSelect(tag.get('name'))}
						className={classNames(
							tag.get('color') && themeMap[tag.get('color') as ThemeName],
						)}
					>
						<span>{tag.get('icon') ?? <Icon name="tag" />}</span>
						<span>{tag.get('name')}</span>
					</TagButtonBase>
				</RecipeTagMenuWrapper>
			))}
		</div>
	);
}

const TagButtonBase = forwardRef<HTMLButtonElement, ButtonProps>(
	function TagButtonBase({ className, ...props }, ref) {
		return (
			<Button
				ref={ref}
				size="small"
				color="primary"
				{...props}
				className={classNames(classes.tagButton, className)}
			/>
		);
	},
);
