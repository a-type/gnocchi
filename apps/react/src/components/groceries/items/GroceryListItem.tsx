import {
	CollapsibleContent,
	CollapsibleRoot,
	CollapsibleTrigger,
} from '@/components/primitives/Collapsible.js';
import { Box, Button, ButtonProps } from '@/components/primitives/index.js';
import { PersonAvatar } from '@/components/sync/PersonAvatar.js';
import { useIsFirstRender } from '@/hooks/usePrevious.js';
import { keyframes, styled } from '@/stitches.config.js';
import { groceries, hooks, Item } from '@/stores/groceries/index.js';
import { useDraggable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UserInfo } from '@lo-fi/web';
import { HamburgerMenuIcon, TrashIcon } from '@radix-ui/react-icons';
import pluralize from 'pluralize';
import React, {
	CSSProperties,
	forwardRef,
	Ref,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { useSnapshot } from 'valtio';
import { Checkbox } from '../../primitives/Checkbox.js';
import { groceriesState } from '../state.js';
import { CategoryPicker } from './CategoryPicker.js';
import { useItemDisplayText } from './hooks.js';
import { ItemDeleteButton } from './ItemDeleteButton.js';
import { ItemQuantityNumber } from './ItemQuantityNumber.js';
import { ItemSources } from './ItemSources.js';

const DEBUG_SORT = false;

export interface GroceryListItemProps {
	className?: string;
	item: Item;
	isDragActive?: boolean;
	style?: CSSProperties;
	menuProps?: Omit<ButtonProps, 'item'> & {
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

		const isPurchased =
			item.get('purchasedQuantity') >= item.get('totalQuantity');
		const isPartiallyPurchased = item.get('purchasedQuantity') > 0;
		const displayString = useItemDisplayText(item);

		const togglePurchased = useCallback(() => {
			return groceries.toggleItemPurchased(item);
		}, [item]);

		const quantityJustChanged = useDidQuantityJustChange(item);
		const justMoved = useDidJustMove(item);

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
				justMoved={justMoved}
			>
				<CollapsibleRoot open={menuOpen} onOpenChange={setMenuOpen}>
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
							{item.get('inputs').length > 1 && (
								<ItemQuantityNumber value={item.get('totalQuantity')} />
							)}
							{displayString}
							{DEBUG_SORT && (
								<span style={{ marginLeft: '1ch' }}>{item.get('sortKey')}</span>
							)}
						</Box>
						<RecentPeople item={item} />
						<CollapsibleTrigger asChild>
							<Button
								color="ghost"
								css={{
									position: 'relative',
									zIndex: menuOpen ? 'calc($menu + 1)' : 'initial',
								}}
								{...menuProps}
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

function useDidJustMove(item: Item) {
	const { justMovedItemId } = useSnapshot(groceriesState);
	return justMovedItemId === item.get('id');
}

function useDidQuantityJustChange(item: Item) {
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

const popUp = keyframes({
	from: {
		opacity: 0,
		transform: 'translateY(30px) scale(0.95)',
	},
	to: {
		opacity: 1,
		transform: 'translateY(0) scale(1)',
	},
});

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
		justMoved: {
			true: {
				animation: `${popUp} 0.4s $transitions$springy`,
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
	item: Item;
	nextSortKey: string | null;
	prevSortKey: string | null;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		isDragging,
		setActivatorNodeRef,
	} = useDraggable({
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
			// transform: transformString,
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

function RecentPeople({ item }: { item: Item }) {
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
