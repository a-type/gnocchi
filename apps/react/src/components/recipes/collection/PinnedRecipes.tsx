import { Icon } from '@/components/icons/Icon.jsx';
import { HelpTip } from '@/components/promotional/HelpTip.jsx';
import { RecipeListItemMenu } from '@/components/recipes/collection/RecipeListItem.jsx';
import {
	useRecipeFoodFilter,
	useRecipeTagFilter,
	useRecipeTitleFilter,
} from '@/components/recipes/collection/hooks.js';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { AddToListButton } from '@/components/recipes/viewer/AddToListButton.jsx';
import { RecipeTagsViewer } from '@/components/recipes/viewer/RecipeTagsViewer.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { Button } from '@a-type/ui/components/button';
import { CollapsibleSimple } from '@a-type/ui/components/collapsible';
import { Divider } from '@a-type/ui/components/divider';
import { H2 } from '@a-type/ui/components/typography';
import { DrawingPinFilledIcon } from '@radix-ui/react-icons';
import { Link } from '@verdant-web/react-router';
import classNames from 'classnames';
import addWeeks from 'date-fns/addWeeks';
import { useMemo } from 'react';

export interface PinnedRecipesProps {
	className?: string;
}

const THREE_WEEKS_AGO = addWeeks(Date.now(), -3).getTime();

export function PinnedRecipes({ className }: PinnedRecipesProps) {
	// prevent thrashing
	const endOfDay = useMemo(() => {
		const date = new Date();
		date.setHours(23, 59, 59, 999);
		return date.getTime();
	}, []);
	const pinnedRecipes = hooks.useAllRecipes({
		index: {
			where: 'pinnedAt',
			gt: THREE_WEEKS_AGO,
			lt: endOfDay,
		},
		key: 'pinnedRecipes',
	});

	const [tagFilter] = useRecipeTagFilter();
	const [foodFilter] = useRecipeFoodFilter();
	const [titleFilter] = useRecipeTitleFilter();

	const show =
		!!pinnedRecipes.length && !(tagFilter || foodFilter || titleFilter);

	return (
		<CollapsibleSimple
			open={show}
			className={classNames('flex flex-col', className)}
		>
			<div className="flex flex-row gap-2 items-center">
				<H2 className="mb-0">Pinned</H2>
				<HelpTip>
					Pins help you organize upcoming dishes. They expire after 3 weeks.
				</HelpTip>
			</div>
			<div className="flex flex-col gap-2">
				{pinnedRecipes.map((recipe) => (
					<PinnedRecipeListItem recipe={recipe} key={recipe.get('id')} />
				))}
			</div>
			<Divider className="my-4" />
		</CollapsibleSimple>
	);
}

function PinnedRecipeListItem({ recipe }: { recipe: Recipe }) {
	const { title } = hooks.useWatch(recipe);

	return (
		<div className="flex flex-row items-center gap-1 border border-solid border-gray-5 rounded-lg px-1 py-2">
			<Button
				size="icon"
				color="ghostDestructive"
				onClick={() => recipe.set('pinnedAt', null)}
			>
				<DrawingPinFilledIcon />
			</Button>
			<Link
				to={makeRecipeLink(recipe, '')}
				className={classNames(
					'flex-1 flex flex-col gap-2px',
					title.length > 20 && 'text-sm',
				)}
			>
				<div className="text-md overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
					{title}
				</div>
				<RecipeTagsViewer recipe={recipe} limit={1} className="text-xs" />
			</Link>
			<AddToListButton
				recipe={recipe}
				size="icon"
				color="ghost"
				className="flex-shrink-0"
			>
				<Icon name="add_to_list" />
			</AddToListButton>
			<RecipeListItemMenu recipe={recipe} className="flex-shrink-0" />
		</div>
	);
}
