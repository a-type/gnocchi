import { Icon } from '@/components/icons/Icon.jsx';
import { HelpTip } from '@/components/promotional/HelpTip.jsx';
import { RecipeListItemMenu } from '@/components/recipes/collection/RecipeListItem.jsx';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { AddToListButton } from '@/components/recipes/viewer/AddToListButton.jsx';
import { RecipeTagsViewer } from '@/components/recipes/viewer/RecipeTagsViewer.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { Button } from '@aglio/ui/components/button';
import { CardGrid } from '@aglio/ui/components/card';
import { Divider } from '@aglio/ui/components/divider';
import { H2 } from '@aglio/ui/components/typography';
import { Cross2Icon, DrawingPinFilledIcon } from '@radix-ui/react-icons';
import { Link } from '@verdant-web/react-router';
import classNames from 'classnames';
import addWeeks from 'date-fns/addWeeks';

export interface PinnedRecipesProps {}

const THREE_WEEKS_AGO = addWeeks(Date.now(), -3).getTime();

export function PinnedRecipes({}: PinnedRecipesProps) {
	const pinnedRecipes = hooks.useAllRecipes({
		index: {
			where: 'pinnedAt',
			gt: THREE_WEEKS_AGO,
		},
		key: 'pinnedRecipes',
	});

	if (!pinnedRecipes.length) {
		return null;
	}

	return (
		<div className="flex flex-col">
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
			<Divider className="mt-3" />
		</div>
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
				<div className="text-md overflow-hidden text-ellipsis whitespace-nowrap">
					{title}
				</div>
				<RecipeTagsViewer recipe={recipe} limit={1} className="text-xs" />
			</Link>
			<AddToListButton recipe={recipe} size="icon" color="ghost">
				<Icon name="add_to_list" />
			</AddToListButton>
			<RecipeListItemMenu recipe={recipe} />
		</div>
	);
}
