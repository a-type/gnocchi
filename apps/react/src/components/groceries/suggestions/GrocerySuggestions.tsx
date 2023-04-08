import { Icon } from '@/components/icons/Icon.jsx';
import { AddToListButton } from '@/components/recipes/viewer/AddToListButton.jsx';
import { RecipeMainImageViewer } from '@/components/recipes/viewer/RecipeMainImageViewer.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Food, Item, Recipe } from '@aglio/groceries-client';
import { Button } from '@aglio/ui/components/button';
import {
	CollapsibleContent,
	CollapsibleRoot,
	CollapsibleTrigger,
} from '@aglio/ui/components/collapsible';
import { H5, Span } from '@aglio/ui/components/typography';
import { CaretDownIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';
import { title, titleRow } from '../categories/GroceryListCategory.css.js';
import * as classes from './GrocerySuggestions.css.js';
import { useExpiresSoonItems } from '@/components/pantry/hooks.js';
import {
	FoodName,
	useFoodName,
	useLookupFoodName,
} from '@/components/foods/FoodName.jsx';

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
	const expiresSoonItems = useExpiresSoonItems();

	if (
		!guessedFoods.length &&
		!guessedRecipes.length &&
		!expiresSoonItems.length
	)
		return null;

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
				{!!guessedFoods.length ||
					(!!guessedRecipes.length && (
						<H5 className={classes.subtitle}>Favorites</H5>
					))}
				{guessedFoods.map((food) => (
					<FoodSuggestionItem key={food.get('canonicalName')} food={food} />
				))}
				{guessedRecipes.map((recipe) => (
					<RecipeSuggestionItem key={recipe.get('id')} recipe={recipe} />
				))}
				{!!expiresSoonItems.length && (
					<H5 className={classes.subtitle}>Expiring soon</H5>
				)}
				{expiresSoonItems.map((item) => (
					<ExpiresSoonSuggestionItem key={item.get('id')} item={item} />
				))}
			</CollapsibleContent>
		</CollapsibleRoot>
	);
}

function FoodSuggestionItem({ food }: { food: Food }) {
	const addItems = hooks.useAddItems();
	const name = useFoodName(food);

	return (
		<div className={classes.item}>
			<div className={classes.name}>{name}</div>
			<Button
				size="icon"
				color="ghost"
				className={classes.addButton}
				onClick={async () => {
					await addItems([name], {});
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

function ExpiresSoonSuggestionItem({ item }: { item: Item }) {
	const addItems = hooks.useAddItems();
	const name = useLookupFoodName(item.get('food'));

	return (
		<div className={classes.item}>
			<div className={classes.name}>{name}</div>
			<Button
				size="icon"
				color="ghost"
				className={classes.addButton}
				onClick={async () => {
					await addItems([name], {});
				}}
			>
				<PlusCircledIcon />
			</Button>
		</div>
	);
}
