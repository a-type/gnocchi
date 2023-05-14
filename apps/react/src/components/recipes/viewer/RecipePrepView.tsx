import { LinkButton } from '@/components/nav/Link.jsx';
import { HeaderBar } from '@/components/recipes/layout/HeaderBar.jsx';
import { PageNowPlaying } from '@aglio/ui/components/layouts';
import { H1, H2, P } from '@aglio/ui/components/typography';
import { makeRecipeLink } from '../makeRecipeLink.js';
import { CookingActionBar } from './CookingActionBar.jsx';
import { IngredientCheckoffView } from './IngredientCheckoffView.jsx';
import { useCookingRecipe } from './RecipeCookContext.jsx';

export interface RecipePrepViewProps {}

export function RecipePrepView({}: RecipePrepViewProps) {
	const recipe = useCookingRecipe();

	return (
		<div className="flex flex-col gap-3">
			<HeaderBar backUrl={makeRecipeLink(recipe, '')}>
				<CookingActionBar recipe={recipe} />
			</HeaderBar>
			<H1 gutterBottom={false}>{recipe.get('title')}</H1>
			<H2 gutterBottom={false}>Prep</H2>
			<P size="xs">
				Prepping ingredients by collecting them and pre-measuring quantities can
				help cooking go faster. Use the button below to skip ahead.
			</P>
			<IngredientCheckoffView recipe={recipe} />
			<PageNowPlaying className="flex flex-col" unstyled>
				<LinkButton
					color="primary"
					align="end"
					to={makeRecipeLink(recipe, '/cook/steps')}
				>
					Start cooking
				</LinkButton>
			</PageNowPlaying>
		</div>
	);
}
