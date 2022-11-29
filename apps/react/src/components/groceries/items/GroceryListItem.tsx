import {
	CollapsibleContent,
	CollapsibleRoot,
	CollapsibleTrigger,
} from '@/components/primitives/Collapsible.js';
import { Box, Button, ButtonProps } from '@/components/primitives/index.js';
import { PersonAvatar } from '@/components/sync/people/PersonAvatar.js';
import useMergedRef from '@/hooks/useMergedRef.js';
import { useIsFirstRender } from '@/hooks/usePrevious.js';
import { useSize, useSizeCssVars } from '@/hooks/useSize.js';
import {
	groceries,
	hooks,
	Item,
	Presence,
	Profile,
} from '@/stores/groceries/index.js';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { UserInfo } from '@lo-fi/web';
import { HamburgerMenuIcon, TrashIcon } from '@radix-ui/react-icons';
import { clsx } from 'clsx';
import React, {
	CSSProperties,
	forwardRef,
	Ref,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useSnapshot } from 'valtio';
import { Checkbox } from '../../primitives/Checkbox.js';
import { groceriesState } from '../state.js';
import { CategoryPicker } from './CategoryPicker.js';
import * as classes from './GroceryListItem.css.js';
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
function preventDefault(e: React.MouseEvent | React.PointerEvent) {
	e.preventDefault();
}

export const GroceryListItem = forwardRef<HTMLDivElement, GroceryListItemProps>(
	function GroceryListItem(
		{ item, isDragActive, menuProps, className, ...rest },
		ref,
	) {
		const { purchasedAt, totalQuantity, sortKey, id } = hooks.useWatch(item);
		const inputs = hooks.useWatch(item.get('inputs'));

		const [purchasedHiddenState, setHiddenState] = useState<
			'hidden' | 'hiding' | 'visible'
		>(() => {
			return purchasedAt ? 'hidden' : 'visible';
		});
		useEffect(() => {
			if (purchasedAt) {
				setHiddenState('hiding');
				const timeout = setTimeout(() => {
					setHiddenState('hidden');
					groceriesState.recentlyPurchasedItems.delete(id);
				}, 3000);
				return () => {
					clearTimeout(timeout);
					setHiddenState('visible');
					groceriesState.recentlyPurchasedItems.delete(id);
				};
			} else {
				setHiddenState('visible');
			}
		}, [purchasedAt, id]);

		const [menuOpen, setMenuOpen] = useState(false);

		const sectionStateSnap = useSnapshot(groceriesState);

		const isPurchased = !!purchasedAt;
		const isPartiallyPurchased = false;
		const displayString = useItemDisplayText(item);

		const togglePurchased = useCallback(async () => {
			await groceries.toggleItemPurchased(item);
		}, [item]);

		const quantityJustChanged = useDidQuantityJustChange(item);
		const justMoved = useDidJustMove(item);

		const sizeRef = useSizeCssVars();

		const finalRef = useMergedRef(ref, sizeRef);

		return (
			<div
				className={clsx('item', classes.root, className)}
				hidden={sectionStateSnap.newCategoryPendingItem?.get('id') === id}
				{...rest}
				ref={finalRef}
				data-highlighted={quantityJustChanged}
				data-dragging={isDragActive}
				data-item-id={id}
				data-oid={item.oid}
				data-menu-open={menuOpen}
				data-just-moved={justMoved}
				data-hidden-state={purchasedHiddenState}
			>
				<CollapsibleRoot open={menuOpen} onOpenChange={setMenuOpen}>
					<div className={classes.mainContent}>
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
						<div className={classes.textContent}>
							{inputs.length > 1 && (
								<ItemQuantityNumber value={totalQuantity} />
							)}
							{displayString}
							{DEBUG_SORT && (
								<span style={{ marginLeft: '1ch' }}>{sortKey}</span>
							)}
						</div>
						<RecentPeople item={item} />
						<CollapsibleTrigger asChild>
							<Button
								color="ghost"
								css={{
									position: 'relative',
									zIndex: menuOpen ? 'calc($menu + 1)' : 'initial',
								}}
								onContextMenu={preventDefault}
								{...menuProps}
							>
								<HamburgerMenuIcon />
							</Button>
						</CollapsibleTrigger>
					</div>
					<CollapsibleContent>
						<div className={classes.secondaryContent}>
							<ItemSources item={item} />
							<CategoryPicker item={item} />
							<ItemDeleteButton color="ghost" item={item}>
								<TrashIcon />
							</ItemDeleteButton>
						</div>
					</CollapsibleContent>
				</CollapsibleRoot>
				{isPurchased && <div className={classes.strikethrough} />}
			</div>
		);
	},
);

function useDidJustMove(item: Item) {
	const { justMovedItemId } = useSnapshot(groceriesState);
	return justMovedItemId === item.get('id');
}

function useDidQuantityJustChange(item: Item) {
	const totalQuantity = hooks.useWatch(item, 'totalQuantity');
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
	}, [totalQuantity, isFirstRenderRef]);

	return didQuantityChange;
}

const touchActionNoneStyle = { touchAction: 'none' };

export function GroceryListItemDraggable({ item, ...rest }: { item: Item }) {
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
			opacity: isDragging ? 0.2 : undefined,
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
		<div className={classes.peopleStack}>
			{people.map((person) => (
				<PersonAvatar
					key={person.id}
					person={person}
					className={classes.person}
				/>
			))}
		</div>
	);
}

function usePeopleWhoLastEditedThis(itemId: string) {
	const groceries = hooks.useClient();
	const [people, setPeople] = useState<UserInfo<Profile, Presence>[]>(() => {
		return Object.values(groceries.sync.presence.peers).filter(
			(p) => p.presence.lastInteractedItem === itemId,
		);
	});
	useEffect(() => {
		return groceries.sync.presence.subscribe('peersChanged', () => {
			setPeople(
				Object.values(groceries.sync.presence.peers).filter(
					(p) => p.presence.lastInteractedItem === itemId,
				),
			);
		});
	}, []);

	return people;
}
