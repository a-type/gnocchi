import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HamburgerMenuIcon, TrashIcon } from '@radix-ui/react-icons';
import { PopoverAnchor } from '@radix-ui/react-popover';
import { Box, Button } from '@/components/primitives/index.js';
import {
	Popover,
	PopoverArrow,
	PopoverContent,
} from '@/components/primitives/Popover.js';
import { useIsFirstRender } from '@/hooks/usePrevious.js';
import pluralize from 'pluralize';
import React, {
	ComponentPropsWithoutRef,
	CSSProperties,
	forwardRef,
	memo,
	Ref,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { styled } from '@/stitches.config.js';
import { useSnapshot } from 'valtio';
import { Checkbox } from '../../primitives/Checkbox.js';
import { groceriesState } from '../state.js';
import { ItemQuantityNumber } from './ItemQuantityNumber.js';
import { groceries, hooks, GroceryItem } from '@/stores/groceries/index.js';
import { UserInfo, Presence, Profile } from '@lo-fi/web';
import { PersonAvatar } from '@/components/sync/PersonAvatar.js';
import { CategoryPicker } from './CategoryPicker.js';
import {
	CollapsibleContent,
	CollapsibleRoot,
	CollapsibleTrigger,
} from '@/components/primitives/Collapsible.js';
import { ItemDeleteButton } from './ItemDeleteButton.js';
import { ItemSources } from './ItemSources.js';

const DEBUG_SORT = false;

export interface GroceryListItemProps {
	className?: string;
	item: GroceryItem;
	isDragActive?: boolean;
	style?: CSSProperties;
	menuProps?: Omit<GroceryListItemMenuProps, 'item'> & {
		ref?: Ref<HTMLButtonElement>;
	};
}

function stopPropagation(e: React.MouseEvent | React.PointerEvent) {
	e.stopPropagation();
}

export const GroceryListItem = forwardRef<HTMLDivElement, GroceryListItemProps>(
	function GroceryListItem({ item, isDragActive, menuProps, ...rest }, ref) {
		hooks.useWatch(item);

		const [menuOpen, setMenuOpen] = useState(false);

		const sectionStateSnap = useSnapshot(groceriesState);
		const inputs = item.get('inputs');

		const isPurchased =
			item.get('purchasedQuantity') >= item.get('totalQuantity');
		const isPartiallyPurchased = item.get('purchasedQuantity') > 0;
		const pluralizedUnit = item.get('unit')
			? item.get('totalQuantity') === 1
				? item.get('unit')
				: pluralize(item.get('unit'))
			: '';
		const pluralizedName =
			item.get('totalQuantity') === 1
				? item.get('food')
				: pluralize(item.get('food'));
		const showOnlyInput = inputs.length === 1;
		const displayString = showOnlyInput
			? inputs.get(0).get('text')
			: `${pluralizedUnit && `${pluralizedUnit} `}${pluralizedName}`;

		const togglePurchased = useCallback(() => {
			return groceries.toggleItemPurchased(item);
		}, [item]);

		const quantityJustChanged = useDidQuantityJustChange(item);

		return (
			<ItemContainer
				hidden={
					sectionStateSnap.newCategoryPendingItem?.get('id') === item.get('id')
				}
				{...rest}
				ref={ref}
				highlighted={quantityJustChanged}
				dragging={isDragActive}
				data-item-id={item.get('id')}
				data-oid={item.oid}
				menuOpen={menuOpen}
			>
				<CollapsibleRoot open={menuOpen}>
					<ItemMainContent>
						<Checkbox
							checked={
								isPurchased
									? true
									: isPartiallyPurchased
									? 'indeterminate'
									: false
							}
							onCheckedChange={togglePurchased}
							// prevent click/tap from reaching draggable container -
							// don't disrupt a check action
							onMouseDown={stopPropagation}
							onMouseUp={stopPropagation}
							onPointerDown={stopPropagation}
							onPointerUp={stopPropagation}
						/>
						<Box direction="row" gap={1} flex={1}>
							{!showOnlyInput && (
								<ItemQuantityNumber value={item.get('totalQuantity')} />
							)}
							{displayString}
							{DEBUG_SORT && (
								<span style={{ marginLeft: '1ch' }}>{item.get('sortKey')}</span>
							)}
						</Box>
						<RecentPeople item={item} />
						{/* <CategoryPicker item={item} /> */}
						<CollapsibleTrigger asChild>
							{/* <GroceryListItemMenu item={item} {...menuProps} /> */}
							<Button
								aria-haspopup="menu"
								aria-expanded={menuOpen ? true : undefined}
								data-state={menuOpen ? 'open' : undefined}
								// aria-controls={menuId}
								color="ghost"
								onPointerUp={(event) => {
									// don't activate the menu if an item was dragged during this gesture
									if (groceriesState.isAnyItemDragged) {
										return;
									}

									if (event.button === 0 && event.ctrlKey === false) {
										setMenuOpen((v) => !v);
										event.preventDefault();
									}
								}}
								onKeyDown={(event) => {
									if (['Enter', ' '].includes(event.key)) {
										setMenuOpen((v) => !v);
									}
									if (event.key === 'ArrowDown') {
										setMenuOpen((v) => !v);
									}
									// prevent scrolling
									if ([' ', 'ArrowDown'].includes(event.key)) {
										event.preventDefault();
									}
								}}
								css={{
									position: 'relative',
									zIndex: menuOpen ? 'calc($menu + 1)' : 'initial',
								}}
								{...menuProps}
								ref={ref}
							>
								<HamburgerMenuIcon />
							</Button>
						</CollapsibleTrigger>
					</ItemMainContent>
					<CollapsibleContent>
						<Box direction="row" gap="2" justify="end" css={{ p: '$3' }}>
							<ItemSources
								item={item}
								css={{ marginRight: 'auto', mt: '$2', ml: '$2' }}
							/>
							<CategoryPicker item={item} />
							<ItemDeleteButton color="ghost" item={item}>
								<TrashIcon />
							</ItemDeleteButton>
						</Box>
					</CollapsibleContent>
				</CollapsibleRoot>
			</ItemContainer>
		);
	},
);

function useDidQuantityJustChange(item: GroceryItem) {
	const [didQuantityChange, setDidQuantityChange] = useState(false);
	const isFirstRenderRef = useIsFirstRender();
	useEffect(() => {
		if (isFirstRenderRef.current) {
			// nothing
		} else {
			setDidQuantityChange(true);
			const timeout = setTimeout(() => setDidQuantityChange(false), 1000);
			return () => clearTimeout(timeout);
		}
	}, [item.get('totalQuantity'), isFirstRenderRef]);

	return didQuantityChange;
}

const ItemContainer = styled('div' as const, {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'stretch',
	width: '100%',
	gap: '$2',
	backgroundColor: '$light',
	borderRadius: '$md',
	position: 'relative',
	animation: 'none',
	userSelect: 'none',

	transition: 'all 0.2s $transitions$springy',

	variants: {
		hidden: {
			true: {
				visibility: 'hidden',
				pointerEvents: 'none',
			},
			false: {},
		},
		dragging: {
			true: {
				boxShadow: '$xl',
				cursor: 'grabbing',
				touchAction: 'none',
				border: '1px solid $colors$gray50',
			},
		},
		highlighted: {
			true: {
				backgroundColor: '$lemonLighter',
			},
		},
		menuOpen: {
			true: {
				backgroundColor: '$white',
				border: '1px solid $colors$gray50',
			},
		},
	},
});

const ItemMainContent = styled('div' as const, {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	gap: '$2',
	padding: '$3',
});

const touchActionNoneStyle = { touchAction: 'none' };

export function GroceryListItemDraggable({
	item,
	nextSortKey,
	prevSortKey,
	...rest
}: {
	item: GroceryItem;
	nextSortKey: string | null;
	prevSortKey: string | null;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
		setActivatorNodeRef,
	} = useSortable({
		id: item.get('id'),
		data: {
			type: 'item',
			value: item,
			nextSortKey,
			prevSortKey,
		},
	});

	const handleProps = useMemo(
		() => ({
			...listeners,
			...attributes,
			style: touchActionNoneStyle,
			ref: setActivatorNodeRef,
		}),
		[listeners, attributes, setActivatorNodeRef],
	);

	const transformString = CSS.Transform.toString(transform);
	const style = useMemo(
		() => ({
			transform: transformString,
			opacity: isDragging ? 0.2 : 1,
		}),
		[isDragging, transformString],
	);

	return (
		<GroceryListItem
			item={item}
			ref={setNodeRef}
			style={style}
			menuProps={handleProps}
			{...rest}
		/>
	);
}

function RecentPeople({ item }: { item: GroceryItem }) {
	const people = usePeopleWhoLastEditedThis(item.get('id'));

	if (people.length === 0) {
		return null;
	}

	return (
		<PeopleStack>
			{people.map((person) => (
				<PersonAvatar key={person.id} person={person} />
			))}
		</PeopleStack>
	);
}

const PeopleStack = styled('div', {
	display: 'flex',
	flexDirection: 'row',

	'& > *': {
		position: 'relative',
		zIndex: 'var(--index)',
		left: 'calc(var(--index) * -8px)',
	},
});

function usePeopleWhoLastEditedThis(itemId: string) {
	const groceries = hooks.useStorage();
	const [people, setPeople] = useState<UserInfo[]>(() => {
		return Object.values(groceries.presence.peers).filter(
			(p) => p.presence.lastInteractedItem === itemId,
		);
	});
	useEffect(() => {
		return groceries.presence.subscribe('peersChanged', () => {
			setPeople(
				Object.values(groceries.presence.peers).filter(
					(p) => p.presence.lastInteractedItem === itemId,
				),
			);
		});
	}, []);

	return people;
}
