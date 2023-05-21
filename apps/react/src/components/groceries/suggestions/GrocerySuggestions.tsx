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
import { H5 } from '@aglio/ui/components/typography';
import { CaretDownIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';
import { useExpiresSoonItems } from '@/components/pantry/hooks.js';
import {
	useFoodName,
	useLookupFoodName,
} from '@/components/foods/FoodName.jsx';
import { useListId } from '@/contexts/ListContext.jsx';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import {
	CategoryTitle,
	CategoryTitleRow,
} from '@/components/groceries/categories/CategoryTitleRow.jsx';
import { withClassName } from '@aglio/ui/hooks';
import classNames from 'classnames';

export interface GrocerySuggestionsProps {}

const NOW = startOfDay(new Date()).getTime();
const SUGGESTION_INTERVAL_END = addDays(NOW, 5).getTime();

export function GrocerySuggestions({}: GrocerySuggestionsProps) {
	const [open, setOpen] = useLocalStorage('grocery-suggestions-open', true);

	const alreadyPresent = hooks.useAllItems({
		index: {
			where: 'purchased',
			equals: 'no',
		},
	});

	const guessedFoodsRaw = hooks.useAllFoods({
		index: {
			where: 'repurchaseAfter',
			gt: NOW,
			lt: SUGGESTION_INTERVAL_END,
			order: 'desc',
		},
	});
	// TODO: limit in lo-fi
	const guessedFoods = guessedFoodsRaw
		.filter(
			(food) =>
				!alreadyPresent.some(
					(item) => item.get('food') === food.get('canonicalName'),
				),
		)
		.slice(0, 5);
	const guessedRecipesRaw = hooks.useAllRecipes({
		index: {
			where: 'suggestAfter',
			gt: NOW,
			lt: SUGGESTION_INTERVAL_END,
			order: 'desc',
		},
	});
	const guessedRecipes = guessedRecipesRaw.slice(0, 5);
	const expiresSoonItemsRaw = useExpiresSoonItems();
	const expiresSoonItems = expiresSoonItemsRaw
		.filter(
			(item) =>
				!alreadyPresent.some(
					(alreadyPresentItem) =>
						alreadyPresentItem.get('food') === item.get('food'),
				),
		)
		.slice(0, 5);

	if (
		!guessedFoods.length &&
		!guessedRecipes.length &&
		!expiresSoonItems.length
	)
		return null;

	return (
		<CollapsibleRoot
			open={open}
			onOpenChange={setOpen}
			className={classNames(
				'flex flex-col bg-accentWash overflow-hidden mb-2 p-2',
				'transition-shadow-200',
				'transition-transform-200',
				'transition-colors-500',
				'[&[data-state=closed]]:bg-transparent',
				'sm:rounded-sm',
			)}
		>
			<CollapsibleTrigger asChild>
				<CategoryTitleRow className="cursor-pointer">
					<CaretDownIcon className="mr-2 transition-transform-200 [div[aria-expanded=true]>&]:transform-rotate-180deg" />
					<CategoryTitle className="text-xs">Suggested</CategoryTitle>
					<Icon name="magic" className="mr-3 color-gray-dark-blend" />
				</CategoryTitleRow>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div className="flex flex-col gap-2">
					{!!guessedFoods.length ||
						(!!guessedRecipes.length && (
							<H5 className="ml-3 text-black mb-1 mt-2">Favorites</H5>
						))}
					{guessedFoods.map((food) => (
						<FoodSuggestionItem key={food.get('canonicalName')} food={food} />
					))}
					{guessedRecipes.map((recipe) => (
						<RecipeSuggestionItem key={recipe.get('id')} recipe={recipe} />
					))}
					{!!expiresSoonItems.length && (
						<H5 className="ml-3 text-black mb-1 mt-2">Expiring soon</H5>
					)}
					{expiresSoonItems.map((item) => (
						<ExpiresSoonSuggestionItem key={item.get('id')} item={item} />
					))}
				</div>
			</CollapsibleContent>
		</CollapsibleRoot>
	);
}

const Item = withClassName(
	'div',
	'flex flex-row gap-2 items-center pl-3 pr-5 py-1',
);
const ItemName = withClassName('div', 'flex-1');
const addButtonClass = 'flex-shrink-0 flex-grow-0 flex-basis-auto';

function FoodSuggestionItem({ food }: { food: Food }) {
	const addItems = hooks.useAddItems();
	const name = useFoodName(food);
	const listId = useListId() || null;

	return (
		<Item>
			<ItemName>{name}</ItemName>
			<Button
				size="icon"
				color="ghost"
				className={addButtonClass}
				onClick={async () => {
					await addItems([name], { listId });
				}}
			>
				<PlusCircledIcon />
			</Button>
		</Item>
	);
}

function RecipeSuggestionItem({ recipe }: { recipe: Recipe }) {
	const listId = useListId() || null;
	return (
		<Item>
			<RecipeMainImageViewer
				recipe={recipe}
				className="important:(flex-0-0-auto w-48px h-48px rounded-md)"
			/>
			<div className="flex-1 flex flex-col">
				<span className="text-xs text-darkBlend italic">Recipe</span>
				<span>{recipe.get('title')}</span>
			</div>
			<AddToListButton
				color="ghost"
				size="icon"
				recipe={recipe}
				className={addButtonClass}
				listId={listId}
			>
				<PlusCircledIcon />
			</AddToListButton>
		</Item>
	);
}

function ExpiresSoonSuggestionItem({ item }: { item: Item }) {
	const addItems = hooks.useAddItems();
	const name = useLookupFoodName(item.get('food'));
	const listId = useListId() || null;

	return (
		<Item>
			<ItemName>{name}</ItemName>
			<Button
				size="icon"
				color="ghost"
				className={addButtonClass}
				onClick={async () => {
					await addItems([name], { listId });
				}}
			>
				<PlusCircledIcon />
			</Button>
		</Item>
	);
}
