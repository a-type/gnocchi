import { Icon } from '@/components/icons/Icon.jsx';
import { RecipeTagMenuWrapper } from '@/components/recipes/tags/RecipeTagMenuWrapper.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Button, ButtonProps } from '@a-type/ui/components/button';
import classNames from 'classnames';
import { forwardRef } from 'react';

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
		<div className="flex flex-wrap gap-1 my-1">
			{(showNone || allTags.length === 0) && (
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
							tag.get('color') && `theme-${tag.get('color')}`,
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
				className={classNames('flex items-center gap-1', className)}
			/>
		);
	},
);
