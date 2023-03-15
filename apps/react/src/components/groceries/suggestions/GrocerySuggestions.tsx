import { hooks } from '@/stores/groceries/index.js';
import {
	Button,
	CollapsibleContent,
	CollapsibleRoot,
	CollapsibleTrigger,
	Span,
} from '@aglio/ui';
import startOfDay from 'date-fns/startOfDay';
import { title, titleRow } from '../categories/GroceryListCategory.css.js';
import classNames from 'classnames';
import * as classes from './GrocerySuggestions.css.js';
import { Food, Recipe } from '@aglio/groceries-client';
import {
	CaretDownIcon,
	PlusCircledIcon,
	PlusIcon,
} from '@radix-ui/react-icons';
import addDays from 'date-fns/addDays';
import { Icon } from '@/components/icons/Icon.jsx';
import { AddToListButton } from '@/components/recipes/viewer/AddToListButton.jsx';
import { RecipeMainImageViewer } from '@/components/recipes/viewer/RecipeMainImageViewer.jsx';

export interface GrocerySuggestionsProps {}

const NOW = startOfDay(new Date()).getTime();
const SUGGESTION_INTERVAL_END = addDays(NOW, 5).getTime();

export function GrocerySuggestions({}: GrocerySuggestionsProps) {
	const guessedFoodsRaw = hooks.useAllFoods({
		index: {
			where: 'repurchaseAfter',
			gt: NOW,
			lt: SUGGESTION_INTERVAL_END,
			order: 'desc',
		},
	});
	// TODO: limit in lo-fi
	const guessedFoods = guessedFoodsRaw.slice(0, 5);
	const guessedRecipesRaw = hooks.useAllRecipes({
		index: {
			where: 'suggestAfter',
			gt: NOW,
			lt: SUGGESTION_INTERVAL_END,
			order: 'desc',
		},
	});
	const guessedRecipes = guessedRecipesRaw.slice(0, 5);

	if (!guessedFoods.length && !guessedRecipes.length) return null;

	return (
		<CollapsibleRoot defaultOpen className={classes.root}>
			<CollapsibleTrigger asChild>
				<div className={classNames(classes.trigger, titleRow)}>
					<CaretDownIcon className={classes.triggerIcon} />
					<div className={classNames(title, classes.title)}>Suggested</div>
					<Icon name="magic" className={classes.titleIcon} />
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent className={classes.list}>
				{guessedFoods.map((food) => (
					<FoodSuggestionItem key={food.get('canonicalName')} food={food} />
				))}
				{guessedRecipes.map((recipe) => (
					<RecipeSuggestionItem key={recipe.get('id')} recipe={recipe} />
				))}
			</CollapsibleContent>
		</CollapsibleRoot>
	);
}

function FoodSuggestionItem({ food }: { food: Food }) {
	const addItems = hooks.useAddItems();

	return (
		<div className={classes.item}>
			<div className={classes.name}>{food.get('canonicalName')}</div>
			<Button
				size="icon"
				color="ghost"
				className={classes.addButton}
				onClick={async () => {
					await addItems([food.get('canonicalName')], {});
				}}
			>
				<PlusCircledIcon />
			</Button>
		</div>
	);
}

function RecipeSuggestionItem({ recipe }: { recipe: Recipe }) {
	return (
		<div className={classes.item}>
			<RecipeMainImageViewer recipe={recipe} className={classes.recipeImage} />
			<div className={classes.recipeTitle}>
				<Span className={classes.recipeNote}>Recipe</Span>
				<Span>{recipe.get('title')}</Span>
			</div>
			<AddToListButton
				color="ghost"
				size="icon"
				recipe={recipe}
				className={classes.addButton}
			>
				<PlusCircledIcon />
			</AddToListButton>
		</div>
	);
}
