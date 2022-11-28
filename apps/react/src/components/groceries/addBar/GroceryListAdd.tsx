import { Box, Button, Input } from '@/components/primitives/index.js';
import {
	forwardRef,
	useState,
	useRef,
	useTransition,
	useCallback,
	useMemo,
} from 'react';
import { groceries, hooks } from '@/stores/groceries/index.js';
import { isUrl } from '@aglio/tools';
import {
	Popover,
	PopoverAnchor,
	PopoverContent,
} from '@/components/primitives/Popover.jsx';
import {
	default as Downshift,
	useCombobox,
	UseComboboxState,
	UseComboboxStateChangeOptions,
} from 'downshift';
import { useSize } from '@/hooks/useSize.js';
import useMergedRef from '@/hooks/useMergedRef.js';
import * as classes from './GroceryListAdd.css.js';
import { clsx } from 'clsx';
import { useIsSubscribed } from '@/contexts/AuthContext.jsx';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { state as signupState } from '@/components/sync/StartSignupDialog.jsx';

export interface GroceryListAddProps {
	className?: string;
	listId: string | null;
}

function stateReducer(
	state: UseComboboxState<string>,
	{ type, changes }: UseComboboxStateChangeOptions<string>,
) {
	if (
		type === useCombobox.stateChangeTypes.InputKeyDownEnter &&
		!changes.selectedItem
	) {
		return {
			...changes,
			selectedItem: changes.inputValue,
		};
	}
	return changes;
}

function preventDefault(ev: any) {
	ev.preventDefault();
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

export const GroceryListAdd = forwardRef<HTMLDivElement, GroceryListAddProps>(
	function GroceryListAdd({ listId, ...rest }, ref) {
		const isSubscribed = useIsSubscribed();
		const [hasPastedAUrl, setHasPastedAUrl] = useLocalStorage(
			'hasPastedAUrl',
			false,
		);
		const [randomPlaceholder, setRandomPlaceholder] =
			useState(getRandomPlaceholder);
		const placeholder =
			isSubscribed && !hasPastedAUrl ? 'Try pasting a URL!' : randomPlaceholder;

		// all suggestions are loaded. filtering is done in-memory.
		const suggestions = hooks.useAllSuggestions({
			index: {
				where: 'usageCount',
				order: 'desc',
			},
		});

		const [suggestionPrompt, setSuggestionPrompt] = useState('');
		const [_, startTransition] = useTransition();

		const contentRef = useRef<HTMLDivElement>(null);
		const innerRef = useSize(({ width }) => {
			if (contentRef.current) {
				contentRef.current.style.width = width + 'px';
			}
		});

		const filteredSuggestions = useMemo(() => {
			if (!suggestionPrompt) {
				return suggestions
					.slice(0, 10)
					.map((suggestion) => suggestion.get('text'));
			} else {
				return suggestions
					.filter((suggestion) =>
						suggestion
							.get('text')
							.toLocaleLowerCase()
							.startsWith(suggestionPrompt.toLocaleLowerCase()),
					)
					.slice(0, 10)
					.map((suggestion) => suggestion.get('text'));
			}
		}, [suggestionPrompt]);

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
		} = useCombobox({
			onInputValueChange({ inputValue }) {
				startTransition(() => {
					setSuggestionPrompt(inputValue || '');
				});
			},
			items: filteredSuggestions,
			itemToString(item) {
				return item ?? '';
			},
			async onSelectedItemChange({ selectedItem }) {
				if (selectedItem) {
					if (isUrl(selectedItem)) {
						if (isSubscribed) {
							setHasPastedAUrl(true);
							await groceries.addRecipe(selectedItem);
						} else {
							signupState.status = 'open';
						}
					} else {
						await groceries.addItems([selectedItem], {
							listId,
						});
					}
					setRandomPlaceholder(getRandomPlaceholder());
					reset();
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
					await groceries.addItems(items, {
						listId,
					});
					reset();
				}
			},
			[setInputValue, reset, listId],
		);

		const inputIsUrl = isUrl(inputValue);

		const mergedRef = useMergedRef(ref, innerRef);

		return (
			<Popover open={isOpen}>
				<PopoverAnchor asChild>
					<Box
						w="full"
						direction="row"
						gap={2}
						data-state={isOpen ? 'open' : 'closed'}
						{...rest}
						ref={mergedRef}
					>
						<Input
							name="text"
							required
							css={{ flex: 1 }}
							autoComplete="off"
							{...getInputProps({
								placeholder,
							})}
							onPaste={onInputPaste}
						/>
						<Button color="primary" onClick={() => selectItem(inputValue)}>
							{inputIsUrl ? 'Scan' : 'Add'}
						</Button>
					</Box>
				</PopoverAnchor>
				<PopoverContent
					forceMount
					disableBlur
					radius="md"
					align="start"
					sideOffset={12}
					onOpenAutoFocus={preventDefault}
					padding="none"
					{...getMenuProps({
						ref: contentRef,
					})}
					className={classes.menu}
				>
					<ul className={classes.menuList}>
						{inputIsUrl ? (
							<li
								className={clsx(classes.item, classes.itemHighlighted)}
								onClick={() => selectItem(inputValue)}
							>
								Scan web recipe
							</li>
						) : filteredSuggestions.length > 0 ? (
							filteredSuggestions.map((suggestion, index) => (
								<li
									key={suggestion}
									suggestion={suggestion}
									{...getItemProps({ item: suggestion, index })}
									className={clsx(classes.item, {
										[classes.itemHighlighted]: highlightedIndex === index,
									})}
								>{`${suggestion}`}</li>
							))
						) : (
							<li className={classes.item}>No suggestions</li>
						)}
					</ul>
				</PopoverContent>
			</Popover>
		);
	},
);
