import { HelpTip } from '@/components/promotional/HelpTip.jsx';
import { RecipeListItem } from '@/components/recipes/collection/RecipeListItem.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { CardGrid } from '@aglio/ui/components/card';
import { Divider } from '@aglio/ui/components/divider';
import { H2 } from '@aglio/ui/components/typography';
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
		<div className="flex flex-col gap-4">
			<div className="flex flex-row gap-2 items-center">
				<H2 className="mb-0">Pinned</H2>
				<HelpTip>
					Pins help you organize upcoming dishes. They expire after 3 weeks.
				</HelpTip>
			</div>
			<CardGrid>
				{pinnedRecipes.map((recipe) => (
					<RecipeListItem
						recipe={recipe}
						key={recipe.get('id')}
						className="h-full"
					/>
				))}
			</CardGrid>
			<Divider />
		</div>
	);
}
