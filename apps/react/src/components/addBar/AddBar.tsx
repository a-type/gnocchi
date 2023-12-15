import { recipeSavePromptState } from '@/components/recipes/savePrompt/state.js';
import { signupDialogState as signupState } from '@/components/sync/state.js';
import { useListId } from '@/contexts/ListContext.jsx';
import { useIsSubscribed } from '@/hooks/useAuth.jsx';
import useMergedRef from '@/hooks/useMergedRef.js';
import { hooks } from '@/stores/groceries/index.js';
import { isUrl, stopPropagation, preventDefault } from '@aglio/tools';
import classNames from 'classnames';
import {
	UseComboboxState,
	UseComboboxStateChangeOptions,
	useCombobox,
} from 'downshift';
import {
	ReactNode,
	Suspense,
	forwardRef,
	useCallback,
	useMemo,
	useRef,
	useState,
	useTransition,
} from 'react';
import { useSize } from '@a-type/ui/hooks';
import {
	Popover,
	PopoverAnchor,
	PopoverContent,
} from '@a-type/ui/components/popover';
import { Input } from '@a-type/ui/components/input';
import { Button, ButtonProps } from '@a-type/ui/components/button';
import pluralize from 'pluralize';
import { Food, Recipe } from '@aglio/groceries-client';
import startOfDay from 'date-fns/startOfDay';
import addDays from 'date-fns/addDays';
import { useExpiresSoonItems } from '@/components/pantry/hooks.js';
import { AddToListDialog } from '@/components/recipes/viewer/AddToListDialog.jsx';
import { useDebouncedValue } from '@/hooks/useDebouncedValue.js';
import { Cross2Icon, FileTextIcon, PlusIcon } from '@radix-ui/react-icons';
import { depluralize } from '@aglio/conversion/src/lib/depluralize.js';
import { trpc } from '@/trpc.js';
import { useAISuggestions } from '@/components/addBar/aiSuggestions.js';
import { Icon } from '@/components/icons/Icon.jsx';

export interface AddBarProps {
	className?: string;
	onAdd: (text: string[]) => Promise<void> | void;
	showRichSuggestions?: boolean;
}

function stateReducer(
	state: UseComboboxState<SuggestionData>,
	{ type, changes }: UseComboboxStateChangeOptions<SuggestionData>,
) {
	if (
		changes.inputValue &&
		type === useCombobox.stateChangeTypes.InputKeyDownEnter &&
		!changes.selectedItem
	) {
		if (isUrl(changes.inputValue)) {
			return {
				...changes,
				selectedItem: {
					type: 'url' as const,
					url: changes.inputValue,
					id: changes.inputValue,
				} as SuggestionData,
			};
		}

		return {
			...changes,
			selectedItem: {
				type: 'raw' as const,
				text: changes.inputValue,
				id: changes.inputValue,
			} as SuggestionData,
		};
	}
	return changes;
}

const randomPlaceholders = [
	'Add an item...',
	'Add an item...',
	'Add an item...',
	'Add an item...',
	'dozen eggs',
	'¼ cup sugar',
	'garlic',
	'1 cup flour',
	'1 lb spaghetti',
	'Try pasting a list!',
];
function getRandomPlaceholder() {
	return randomPlaceholders[
		Math.floor(Math.random() * randomPlaceholders.length)
	];
}

type SuggestionData =
	| {
			type: 'raw';
			text: string;
			id: string;
	  }
	| {
			type: 'food';
			name: string;
			id: string;
			ai?: boolean;
	  }
	| {
			type: 'recipe';
			recipe: Recipe;
			id: string;
	  }
	| {
			type: 'url';
			url: string;
			id: string;
	  };

function suggestionToString(item: SuggestionData | undefined | null) {
	if (!item) return '';
	if (item.type === 'food') return item.name;
	if (item.type === 'recipe') return item.recipe.get('title');
	return '';
}

const NOW = startOfDay(new Date()).getTime();
const SUGGESTION_INTERVAL_END = addDays(NOW, 5).getTime();

export const AddBarImpl = forwardRef<HTMLDivElement, AddBarProps>(
	function GroceryListAddImpl({ onAdd, showRichSuggestions, ...rest }, ref) {
		const isSubscribed = useIsSubscribed();
		const listId = useListId() || null;
		const [randomPlaceholder, setRandomPlaceholder] =
			useState(getRandomPlaceholder);

		const [suggestionPrompt, setSuggestionPrompt] = useState('');
		const [_, startTransition] = useTransition();

		const [addingRecipe, setAddingRecipe] = useState<Recipe | null>(null);
		const clearAddingRecipe = useCallback(() => {
			setAddingRecipe(null);
		}, []);

		const { data: existingItems } = hooks.useAllItemsUnsuspended({
			index: {
				where: 'purchased',
				equals: 'no',
			},
		});
		const existingFoods = useMemo(() => {
			const foods = new Set<string>();
			existingItems.forEach((item) => {
				foods.add(item.get('food'));
			});
			return foods;
		}, [existingItems]);

		const foodSearchPrompt = suggestionPrompt
			? depluralize(suggestionPrompt.toLowerCase().trim())
			: '';

		const { firstWord, quantity } = destructureSearchPrompt(foodSearchPrompt);
		const foodMatchPrompt = foodSearchPrompt.replace(quantity, '').trim();

		const { data: searchFoods } = hooks.useAllFoodsUnsuspended({
			index: {
				where: 'nameLookup',
				// only use first word... only one word can match the index.
				startsWith: firstWord,
			},
			limit: 20,
			key: 'addBar_searchFoods',
			// skip: !showRichSuggestions || !foodSearchPrompt,
		});

		const frequencyFoods = hooks.useAllFoods({
			index: {
				where: 'repurchaseAfter',
				gt: NOW,
				lt: SUGGESTION_INTERVAL_END,
				order: 'desc',
			},
			skip: !showRichSuggestions,
			key: 'addBar_frequencyFoods',
		});

		const expiresSoonItems = useExpiresSoonItems({
			skip: !showRichSuggestions,
			key: 'addBar_expiresSoon',
		});
		const expiresSoonSuggestions = useMemo<SuggestionData[]>(() => {
			return expiresSoonItems.slice(0, 5).map((item) => ({
				type: 'food',
				name: item.get('canonicalName'),
				id: item.get('canonicalName'),
			}));
		}, [expiresSoonItems]);

		const mapFoodsToSuggestions = useCallback(
			(foods: Food[], limit = 5): SuggestionData[] => {
				return foods
					.filter((item) => !item.get('doNotSuggest'))
					.filter((item) => !existingFoods.has(item.get('canonicalName')))
					.sort((a, b) => {
						return a.get('purchaseCount') > b.get('purchaseCount') ? -1 : 1;
					})
					.slice(0, limit)
					.map((s) => {
						if (s.get('pluralizeName'))
							return pluralize(s.get('canonicalName'));
						else return s.get('canonicalName');
					})
					.map((s) => ({
						type: 'food',
						name: s,
						id: s,
					}));
			},
			[existingFoods],
		);

		const mapRecipesToSuggestions = useCallback(
			(recipes: Recipe[], limit = 5): SuggestionData[] => {
				return recipes
					.sort((a, b) => {
						return a.get('cookCount') > b.get('cookCount') ? -1 : 1;
					})
					.slice(0, limit)
					.map((s) => ({
						type: 'recipe',
						recipe: s,
						id: s.get('id'),
					}));
			},
			[],
		);

		const frequencyFoodsSuggestions = useMemo<SuggestionData[]>(() => {
			return mapFoodsToSuggestions(frequencyFoods);
		}, [frequencyFoods, mapFoodsToSuggestions]);

		const frequencyRecipes = hooks.useAllRecipes({
			index: {
				where: 'suggestAfter',
				gt: NOW,
				lt: SUGGESTION_INTERVAL_END,
				order: 'desc',
			},
			skip: !showRichSuggestions,
			key: 'addBar_frequencyRecipes',
		});
		const recipeSuggestions = useMemo<SuggestionData[]>(() => {
			return mapRecipesToSuggestions(frequencyRecipes);
		}, [frequencyRecipes]);

		const hasFewSuggestions =
			frequencyFoodsSuggestions.length +
				recipeSuggestions.length +
				expiresSoonSuggestions.length <
			10;

		const searchFoodsSuggestions = useMemo<SuggestionData[]>(() => {
			return mapFoodsToSuggestions(
				searchFoods.filter((food) => {
					if (food.get('canonicalName').includes(foodMatchPrompt)) return true;
					for (const name in food.get('alternateNames')) {
						if (name.includes(foodMatchPrompt)) return true;
					}
					return false;
				}),
				hasFewSuggestions ? 20 : 10,
			);
		}, [
			searchFoods,
			mapFoodsToSuggestions,
			hasFewSuggestions,
			foodMatchPrompt,
		]);

		const { data: searchRecipes } = hooks.useAllRecipesUnsuspended({
			index: {
				where: 'titleMatch',
				startsWith: suggestionPrompt?.toLowerCase().trim() ?? '',
			},
			skip: !showRichSuggestions || !suggestionPrompt,
		});
		const searchRecipeSuggestions = useMemo<SuggestionData[]>(() => {
			return mapRecipesToSuggestions(searchRecipes);
		}, [searchRecipes, mapRecipesToSuggestions]);

		const aiItems = useAISuggestions();
		const aiSuggestions = useMemo<SuggestionData[]>(
			() =>
				aiItems
					.filter((name) => !existingFoods.has(name))
					.map((item) => ({
						type: 'food',
						name: item,
						id: item,
						ai: true,
					})),
			[aiItems],
		);

		const showSuggested =
			!suggestionPrompt &&
			showRichSuggestions &&
			frequencyFoodsSuggestions.length + recipeSuggestions.length > 0;
		const showExpiring =
			!suggestionPrompt &&
			showRichSuggestions &&
			expiresSoonSuggestions.length > 0;

		const showRecipeMatches = !!suggestionPrompt && showRichSuggestions;

		const allSuggestions = useMemo(() => {
			let allSuggestions: SuggestionData[] = [];
			if (showSuggested) {
				allSuggestions.push(...frequencyFoodsSuggestions);
				allSuggestions.push(...aiSuggestions);
				allSuggestions.push(...recipeSuggestions);
			}
			if (showExpiring) {
				allSuggestions.push(...expiresSoonSuggestions);
			}
			allSuggestions.push(...searchFoodsSuggestions);
			if (showRecipeMatches) {
				allSuggestions.push(...searchRecipeSuggestions);
			}
			return allSuggestions;
		}, [
			searchFoodsSuggestions,
			frequencyFoodsSuggestions,
			recipeSuggestions,
			expiresSoonSuggestions,
			searchRecipeSuggestions,
			showSuggested,
			showExpiring,
			showRecipeMatches,
			aiSuggestions,
		]);

		const contentRef = useRef<HTMLDivElement>(null);
		const innerRef = useSize(({ width }) => {
			if (contentRef.current) {
				contentRef.current.style.width = width + 'px';
			}
		});

		const randomSuggestion = useDebouncedValue(
			() => {
				if (allSuggestions.length === 0) return null;
				return allSuggestions[
					Math.floor(Math.random() * allSuggestions.length)
				];
			},
			15000,
			[allSuggestions],
		);
		const placeholder = randomSuggestion
			? suggestionToString(randomSuggestion)
			: randomPlaceholder;

		const {
			isOpen,
			getMenuProps,
			getInputProps,
			highlightedIndex,
			getItemProps,
			reset,
			inputValue,
			setInputValue,
			selectItem,
			openMenu,
		} = useCombobox<SuggestionData>({
			onInputValueChange({ inputValue }) {
				startTransition(() => {
					setSuggestionPrompt(inputValue || '');
				});
			},
			items: allSuggestions,
			itemToString: suggestionToString,
			async onSelectedItemChange({ selectedItem, inputValue }) {
				if (selectedItem) {
					reset();
					if (selectedItem.type === 'raw') {
						await onAdd([selectedItem.text]);
					} else if (selectedItem.type === 'url') {
						if (isSubscribed) {
							recipeSavePromptState.url = selectedItem.url;
						} else {
							signupState.status = 'open';
						}
					} else if (selectedItem.type === 'food') {
						try {
							if (quantity) {
								await onAdd([`${quantity} ${selectedItem.name}`]);
							} else {
								await onAdd([selectedItem.name]);
							}
						} catch (e) {
							setInputValue(inputValue || '');
						}
					} else {
						setAddingRecipe(selectedItem.recipe);
					}
					setRandomPlaceholder(getRandomPlaceholder());
				}
			},
			stateReducer,
		});

		const onInputPaste = useCallback(
			async (event: React.ClipboardEvent<HTMLInputElement>) => {
				// check for multi-line paste or URL paste
				const text = event.clipboardData.getData('text/plain');
				const lines = text.split(/\r?\n/).map((t) => t.trim());
				const items = lines.filter(Boolean);
				if (items.length > 1) {
					await onAdd(items);
					reset();
				}
			},
			[setInputValue, reset, listId],
		);

		const inputIsUrl = isUrl(inputValue);

		const mergedRef = useMergedRef(ref, innerRef);

		let itemIndex = 0;

		const noSuggestions = allSuggestions.length === 0;

		return (
			<>
				<Popover open={isOpen}>
					<PopoverAnchor asChild>
						<div
							data-state={isOpen ? 'open' : 'closed'}
							className="flex gap-2 flex-row w-full relative"
							{...rest}
							ref={mergedRef}
						>
							<Input
								data-test="grocery-list-add-input"
								name="text"
								required
								className="flex-1 pr-[72px]"
								variant="primary"
								autoComplete="off"
								{...getInputProps({
									placeholder,
								})}
								onPaste={onInputPaste}
								onPointerDown={openMenu}
							/>
							<div className="absolute flex flex-row-reverse gap-1 right-1 top-1">
								<Button
									data-test="grocery-list-add-button"
									color="primary"
									size="icon"
									className="w-34px h-34px p-0 items-center justify-center"
									onClick={() =>
										selectItem({
											type: 'raw',
											text: inputValue,
											id: inputValue,
										})
									}
									aria-label={inputIsUrl ? 'scan recipe page' : 'add item'}
								>
									{inputIsUrl ? <Icon name="scan" /> : <PlusIcon />}
								</Button>
								{!!inputValue && (
									<Button
										size="icon"
										color="ghost"
										onClick={() => setInputValue('')}
										aria-label="clear input"
									>
										<Cross2Icon />
									</Button>
								)}
							</div>
						</div>
					</PopoverAnchor>
					<PopoverContent
						forceMount
						disableBlur
						radius="md"
						align="start"
						sideOffset={12}
						onOpenAutoFocus={preventDefault}
						{...getMenuProps({
							ref: contentRef,
						})}
						className={classNames(
							'overflow-x-hidden overflow-y-auto overscroll-contain max-h-[calc(var(--viewport-height,40vh)-140px)] lg:max-h-50vh rounded-lg w-full max-w-none gap-4 p-3',
							'shadow-xl',
						)}
						onPointerDown={stopPropagation}
						onPointerMove={stopPropagation}
						onPointerUp={stopPropagation}
						onScroll={stopPropagation}
						onTouchStart={stopPropagation}
						onTouchMove={stopPropagation}
						onTouchEnd={stopPropagation}
					>
						{showSuggested && (
							<SuggestionGroup title="Suggested">
								{frequencyFoodsSuggestions.map((suggestion) => (
									<SuggestionItem
										key={suggestion.id}
										value={suggestion}
										highlighted={highlightedIndex === itemIndex}
										{...getItemProps({
											item: suggestion,
											index: itemIndex++,
										})}
									/>
								))}
								{aiSuggestions.map((suggestion) => (
									<SuggestionItem
										key={suggestion.id}
										value={suggestion}
										highlighted={highlightedIndex === itemIndex}
										{...getItemProps({
											item: suggestion,
											index: itemIndex++,
										})}
									/>
								))}
								{recipeSuggestions.map((suggestion) => (
									<SuggestionItem
										key={suggestion.id}
										value={suggestion}
										highlighted={highlightedIndex === itemIndex}
										{...getItemProps({
											item: suggestion,
											index: itemIndex++,
										})}
									/>
								))}
							</SuggestionGroup>
						)}
						{showExpiring && (
							<SuggestionGroup title="Expiring Soon">
								{expiresSoonSuggestions.map((suggestion) => (
									<SuggestionItem
										key={suggestion.id}
										value={suggestion}
										highlighted={highlightedIndex === itemIndex}
										{...getItemProps({
											item: suggestion,
											index: itemIndex++,
										})}
									/>
								))}
							</SuggestionGroup>
						)}
						{!noSuggestions && (
							<SuggestionGroup title={inputValue ? 'Matches' : 'Favorites'}>
								{searchFoodsSuggestions.map((suggestion) => (
									<SuggestionItem
										key={suggestion.id}
										value={suggestion}
										highlighted={highlightedIndex === itemIndex}
										{...getItemProps({ item: suggestion, index: itemIndex++ })}
									/>
								))}
								{showRecipeMatches &&
									searchRecipeSuggestions.map((suggestion) => (
										<SuggestionItem
											key={suggestion.id}
											value={suggestion}
											highlighted={highlightedIndex === itemIndex}
											{...getItemProps({
												item: suggestion,
												index: itemIndex++,
											})}
										/>
									))}
							</SuggestionGroup>
						)}
						{noSuggestions && <div>No suggestions</div>}
					</PopoverContent>
				</Popover>
				<AddRecipeDialog
					recipe={addingRecipe}
					onOpenChange={clearAddingRecipe}
				/>
			</>
		);
	},
);

export const AddBar = forwardRef<HTMLDivElement, AddBarProps>(function AddBar(
	props,
	ref,
) {
	return (
		<Suspense fallback={<Skeleton />}>
			<AddBarImpl {...props} ref={ref} />
		</Suspense>
	);
});

function Skeleton() {
	return (
		<div className="flex flex-1 w-full flex-row gap-2">
			<Input
				data-test="grocery-list-add-input"
				name="text"
				required
				disabled
				className="flex-1 rounded-full"
				autoComplete="off"
				placeholder="Loading..."
			/>
		</div>
	);
}

function SuggestionGroup({
	title,
	children,
	className,
	...rest
}: {
	title: string;
	children?: ReactNode;
	className?: string;
}) {
	return (
		<div className={classNames('flex flex-col gap-2', className)} {...rest}>
			<div className="text-xs uppercase text-gray-7 font-bold ml-1">
				{title}
			</div>
			<div className="flex flex-row gap-2 flex-wrap">{children}</div>
		</div>
	);
}

const SuggestionItem = forwardRef<
	HTMLButtonElement,
	ButtonProps & {
		highlighted?: boolean;
		value: SuggestionData;
	}
>(function SuggestionItem({ highlighted, className, value, ...rest }, ref) {
	let displayString;
	if (value.type === 'raw') {
		displayString = value.text;
	} else if (value.type === 'food') {
		displayString = value.name;
	} else if (value.type === 'recipe') {
		displayString = value.recipe.get('title');
	} else {
		displayString = value.url;
	}

	return (
		<Button
			size="small"
			color="default"
			ref={ref}
			className={classNames(
				'rounded-full font-normal border-gray-5 max-w-100% overflow-hidden text-ellipsis flex flex-row',
				{
					'bg-primary-wash': highlighted,
				},
				className,
			)}
			{...rest}
		>
			{value.type === 'recipe' && <FileTextIcon />}
			{value.type === 'food' && value.ai && <Icon name="magic" />}
			<span className="flex-1 overflow-hidden text-ellipsis">
				{displayString}
			</span>
		</Button>
	);
});

function AddRecipeDialog({
	recipe,
	onOpenChange,
}: {
	recipe: Recipe | null;
	onOpenChange: (open: boolean) => void;
}) {
	if (!recipe) return null;
	return (
		<AddToListDialog
			recipe={recipe}
			open={!!recipe}
			onOpenChange={onOpenChange}
		/>
	);
}

/**
 * Pulls out any leading quantity number, and the first
 * whole word, then the rest of the string.
 */
function destructureSearchPrompt(prompt: string): {
	quantity: string;
	firstWord: string;
	rest: string;
} {
	const match = prompt.match(/^(\d+)?\s?(\w+)?\s?(.*)$/);
	if (!match) return { firstWord: '', rest: '', quantity: '' };
	const [, quantity = '', firstWord = '', rest = ''] = match;
	return { quantity, firstWord, rest };
}
