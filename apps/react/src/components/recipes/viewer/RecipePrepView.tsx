import { H1, H2, P } from '@aglio/ui/components/typography';
import { makeRecipeLink } from '../makeRecipeLink.js';
import { CookingActionBar } from './CookingActionBar.jsx';
import { IngredientCheckoffView } from './IngredientCheckoffView.jsx';
import { useCookingRecipe } from './RecipeCookContext.jsx';
import * as classes from './RecipePrepView.css.js';
import { PageFixedArea, PageNowPlaying } from '@aglio/ui/components/layouts';
import { sprinkles } from '@aglio/ui/styles';
import { LinkButton } from '@aglio/ui/components/button';

export interface RecipePrepViewProps {}

export function RecipePrepView({}: RecipePrepViewProps) {
	const recipe = useCookingRecipe();

	return (
		<div className={classes.root}>
			<H1 gutterBottom={false}>{recipe.get('title')}</H1>
			<H2 gutterBottom={false}>Prep</H2>
			<P size="xs">
				Prepping ingredients by collecting them and pre-measuring quantities can
				help cooking go faster. Use the button below to skip ahead.
			</P>
			<PageFixedArea className={sprinkles({ px: 0, py: 1 })}>
				<CookingActionBar recipe={recipe} />
			</PageFixedArea>
			<IngredientCheckoffView recipe={recipe} className={classes.list} />
			<PageNowPlaying className={classes.action} unstyled>
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
