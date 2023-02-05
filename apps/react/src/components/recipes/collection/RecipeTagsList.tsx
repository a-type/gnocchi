import { TagIcon } from '@/components/icons/TagIcon.jsx';
import {
	Button,
	ButtonProps,
	ThemeName,
} from '@/components/primitives/index.js';
import { hooks } from '@/stores/groceries/index.js';
import { themeMap } from '@/styles/themes/map.js';
import classnames from 'classnames';
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
				<TagButtonBase
					key={tag.get('name')}
					toggled={tag.get('name') === selectedValue}
					onClick={() => onSelect(tag.get('name'))}
					className={classnames(
						tag.get('color') && themeMap[tag.get('color') as ThemeName],
					)}
				>
					<span>{tag.get('icon') ?? <TagIcon />}</span>
					<span>{tag.get('name')}</span>
				</TagButtonBase>
			))}
		</div>
	);
}

function TagButtonBase({ className, ...props }: ButtonProps) {
	return (
		<Button
			size="small"
			color="primary"
			{...props}
			className={classnames(classes.tagButton, className)}
		/>
	);
}
