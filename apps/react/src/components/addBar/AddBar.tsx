import { recipeSavePromptState } from '@/components/recipes/savePrompt/RecipeSavePrompt.jsx';
import { signupDialogState as signupState } from '@/components/sync/state.js';
import { useListId } from '@/contexts/ListContext.jsx';
import { useIsSubscribed } from '@/hooks/useAuth.jsx';
import useMergedRef from '@/hooks/useMergedRef.js';
import { hooks } from '@/stores/groceries/index.js';
import { isUrl } from '@aglio/tools';
import classNames from 'classnames';
import {
	UseComboboxState,
	UseComboboxStateChangeOptions,
	useCombobox,
} from 'downshift';
import {
	Suspense,
	forwardRef,
	useCallback,
	useMemo,
	useRef,
	useState,
	useTransition,
} from 'react';
import { useSize } from '@aglio/ui/hooks';
import {
	Popover,
	PopoverAnchor,
	PopoverContent,
} from '@aglio/ui/components/popover';
import { Input } from '@aglio/ui/components/input';
import { withClassName } from '@aglio/ui/hooks';
import { Button } from '@aglio/ui/components/button';

export interface AddBarProps {
	className?: string;
	onAdd: (text: string[]) => Promise<void> | void;
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

export const AddBarImpl = forwardRef<HTMLDivElement, AddBarProps>(
	function GroceryListAddImpl({ onAdd, ...rest }, ref) {
		const isSubscribed = useIsSubscribed();
		const listId = useListId() || null;
		const [randomPlaceholder, setRandomPlaceholder] =
			useState(getRandomPlaceholder);
		const placeholder = randomPlaceholder;

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
			openMenu,
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
							recipeSavePromptState.url = selectedItem;
						} else {
							signupState.status = 'open';
						}
					} else {
						await onAdd([selectedItem]);
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
					await onAdd(items);
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
					<div
						data-state={isOpen ? 'open' : 'closed'}
						className="flex gap-2 flex-row w-full"
						{...rest}
						ref={mergedRef}
					>
						<Input
							data-test="grocery-list-add-input"
							name="text"
							required
							className="flex-1"
							autoComplete="off"
							{...getInputProps({
								placeholder,
							})}
							onPaste={onInputPaste}
							onPointerDown={openMenu}
						/>
						<Button
							data-test="grocery-list-add-button"
							color="primary"
							onClick={() => selectItem(inputValue)}
						>
							{inputIsUrl ? 'Scan' : 'Add'}
						</Button>
					</div>
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
					className="overflow-x-hidden overflow-y-auto max-h-20vh lg:max-h-50vh"
				>
					<ul className="flex flex-col list-none m-0 p-0">
						{inputIsUrl ? (
							<ListItem
								className="bg-primary-wash"
								onClick={() => selectItem(inputValue)}
							>
								Scan web recipe
							</ListItem>
						) : filteredSuggestions.length > 0 ? (
							filteredSuggestions.map((suggestion, index) => (
								<ListItem
									key={suggestion}
									suggestion={suggestion}
									{...getItemProps({ item: suggestion, index })}
									className={classNames({
										['bg-primary-wash']: highlightedIndex === index,
									})}
								>{`${suggestion}`}</ListItem>
							))
						) : (
							<ListItem>No suggestions</ListItem>
						)}
					</ul>
				</PopoverContent>
			</Popover>
		);
	},
);

const ListItem = withClassName(
	'li',
	'list-item flex align-start justify-between w-full rd-0 px-4 py-2 border-width-0 border-black border-style-solid repeated:border-t-1',
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
		<div data-state="closed" className="flex flex-1 w-full flex-row gap-2">
			<Input
				data-test="grocery-list-add-input"
				name="text"
				required
				disabled
				className="flex-1"
				autoComplete="off"
				placeholder="Loading..."
			/>
			<Button data-test="grocery-list-add-button" color="primary">
				Add
			</Button>
		</div>
	);
}
