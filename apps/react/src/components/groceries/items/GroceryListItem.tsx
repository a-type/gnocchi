import { FoodDetailDialog } from '@/components/foods/FoodDetailDialog.jsx';
import { Icon } from '@/components/icons/Icon.jsx';
import { OnboardingTooltip } from '@/components/onboarding/OnboardingTooltip.jsx';
import {
	PeopleList,
	PeopleListItem,
} from '@/components/sync/people/People.jsx';
import { PersonAvatar } from '@/components/sync/people/PersonAvatar.js';
import { useListId } from '@/contexts/ListContext.jsx';
import useMergedRef from '@/hooks/useMergedRef.js';
import { useIsFirstRender, usePrevious } from '@/hooks/usePrevious.js';
import { categorizeOnboarding } from '@/onboarding/categorizeOnboarding.js';
import { Presence, Profile, hooks } from '@/stores/groceries/index.js';
import { Item } from '@aglio/groceries-client';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { UserInfo } from '@lo-fi/web';
import {
	HamburgerMenuIcon,
	Pencil1Icon,
	TrashIcon,
} from '@radix-ui/react-icons';
import { clsx } from 'clsx';
import React, {
	CSSProperties,
	Ref,
	Suspense,
	forwardRef,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { Link } from '@/components/nav/Link.jsx';
import { useSnapshot } from 'valtio';
import { ListSelect } from '../lists/ListSelect.jsx';
import { useListOrNull, useListThemeClass } from '../lists/hooks.js';
import { groceriesState } from '../state.js';
import * as classes from './GroceryListItem.css.js';
import { ItemDeleteButton } from './ItemDeleteButton.js';
import { ItemSources } from './ItemSources.js';
import { useItemDisplayText } from './hooks.js';
import { Button, ButtonProps } from '@aglio/ui/components/button';
import { useSizeCssVars } from '@aglio/ui/hooks';
import {
	CollapsibleContent,
	CollapsibleRoot,
	CollapsibleTrigger,
} from '@aglio/ui/components/collapsible';
import { Checkbox } from '@aglio/ui/components/checkbox';
import { Box } from '@aglio/ui/components/box';
import { LiveUpdateTextField } from '@aglio/ui/components/liveUpdateTextField';
import { Tooltip } from '@aglio/ui/components/tooltip';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@aglio/ui/components/dialog';
import { NumberStepper } from '@aglio/ui/components/numberStepper';
import { sprinkles } from '@aglio/ui/styles';

export interface GroceryListItemProps {
	className?: string;
	item: Item;
	isDragActive?: boolean;
	style?: CSSProperties;
	menuProps?: Omit<ButtonProps, 'item'> & {
		ref?: Ref<HTMLButtonElement>;
	};
	first?: boolean;
}

function stopPropagation(e: React.MouseEvent | React.PointerEvent) {
	e.stopPropagation();
}
function preventDefault(e: React.MouseEvent | React.PointerEvent) {
	e.preventDefault();
}

export const GroceryListItem = forwardRef<HTMLDivElement, GroceryListItemProps>(
	function GroceryListItem(
		{ item, isDragActive, menuProps, className, first, ...rest },
		ref,
	) {
		const { purchasedAt, comment, id, food } = hooks.useWatch(item);

		const isPurchased = !!purchasedAt;
		const { purchasedHidingItems } = useSnapshot(groceriesState);
		const isHiding = purchasedHidingItems.has(id);

		// TODO: clean this up
		const purchasedHiddenState = isHiding ? 'hidden' : 'visible';

		const previousPurchasedAt = usePrevious(isPurchased);
		const wasPurchasedSinceMount = isPurchased && !previousPurchasedAt;
		useEffect(() => {
			if (wasPurchasedSinceMount) {
				groceriesState.purchasedStillVisibleItems.add(id);
			}
		}, [wasPurchasedSinceMount, id]);
		useEffect(() => {
			if (!isPurchased) {
				groceriesState.purchasedStillVisibleItems.delete(id);
			}
		}, [isPurchased]);

		const [menuToggleOpen, setMenuOpen] = useState(false);
		const menuOpen = menuToggleOpen && purchasedHiddenState === 'visible';

		const sectionStateSnap = useSnapshot(groceriesState);

		const isPartiallyPurchased = false;
		const displayString = useItemDisplayText(item);

		const toggleItemPurchased = hooks.useToggleItemPurchased();
		const togglePurchased = useCallback(async () => {
			await toggleItemPurchased(item);
		}, [item]);

		const quantityJustChanged = useDidQuantityJustChange(item);
		const justMoved = useDidJustMove(item);

		const sizeRef = useSizeCssVars();

		const finalRef = useMergedRef(ref, sizeRef);

		return (
			<CollapsibleRoot
				className={clsx('item', classes.root, className)}
				open={menuOpen}
				onOpenChange={setMenuOpen}
				hidden={sectionStateSnap.newCategoryPendingItem?.get('id') === id}
				{...rest}
				ref={finalRef}
				data-highlighted={quantityJustChanged}
				data-dragging={isDragActive}
				data-item-id={id}
				data-oid={(item as any).oid}
				data-menu-open={menuOpen}
				data-just-moved={justMoved}
				data-hidden-state={purchasedHiddenState}
				data-test="grocery-list-item"
			>
				<Checkbox
					checked={
						isPurchased ? true : isPartiallyPurchased ? 'indeterminate' : false
					}
					onCheckedChange={togglePurchased}
					// prevent click/tap from reaching draggable container -
					// don't disrupt a check action
					onMouseDown={stopPropagation}
					onMouseUp={stopPropagation}
					onPointerDown={stopPropagation}
					onPointerUp={stopPropagation}
					data-test="grocery-list-item-checkbox"
					className={classes.checkbox}
				/>
				<div className={classes.mainContent}>
					<div className={classes.textStack}>
						<div className={classes.textContent}>
							<span>{displayString}</span>
							{menuOpen && <QuantityEditor item={item} />}
						</div>
						{isPurchased && <div className={classes.strikethrough} />}
						{comment && !menuOpen && (
							<Box open={!menuOpen} className={classes.comment}>
								{comment}
							</Box>
						)}
					</div>
					<RecentPeople item={item} />
					<ListTag item={item} collapsed={menuOpen} />
					<CollapsibleTrigger asChild>
						<Button
							color="ghost"
							className={sprinkles({
								position: 'relative',
							})}
							size="small"
							onContextMenu={preventDefault}
							{...menuProps}
						>
							{first ? (
								<OnboardingTooltip
									onboarding={categorizeOnboarding}
									step="categorize"
									content="Tap and hold to change category"
									disableNext
								>
									<HamburgerMenuIcon />
								</OnboardingTooltip>
							) : (
								<HamburgerMenuIcon />
							)}
						</Button>
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent className={classes.secondaryCollapse}>
					<Suspense>
						<div className={classes.secondaryContent}>
							<ItemSources item={item} />

							<div className={classes.controls}>
								<LiveUpdateTextField
									value={comment || ''}
									onChange={(val) => item.set('comment', val)}
									placeholder="Add a comment"
									className={classes.commentBox}
								/>
								<ListSelect
									value={item.get('listId')}
									onChange={(listId) => item.set('listId', listId)}
								/>
								<FoodDetailDialog foodName={food} />
								{/* <CategoryPicker item={item} /> */}
								<ItemDeleteButton
									size="icon"
									color="ghostDestructive"
									item={item}
								>
									<TrashIcon />
								</ItemDeleteButton>
							</div>
						</div>
					</Suspense>
				</CollapsibleContent>
			</CollapsibleRoot>
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

export function GroceryListItemDraggable({
	item,
	...rest
}: {
	item: Item;
	first?: boolean;
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
		<PeopleList count={people.length}>
			{people.map((person, index) => (
				<PeopleListItem index={index}>
					<PersonAvatar
						key={person.id}
						person={person}
						className={classes.person}
					/>
				</PeopleListItem>
			))}
		</PeopleList>
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

function ListTag({ item, collapsed }: { item: Item; collapsed?: boolean }) {
	const filteredListId = useListId();

	if (filteredListId !== undefined) {
		// only show list tag when showing all items
		return null;
	}

	const { listId } = hooks.useWatch(item);

	const list = useListOrNull(listId);
	const listThemeClass = useListThemeClass(listId);

	if (!list) {
		return null;
	}

	const name = list.get('name');

	return (
		<Tooltip content={list.get('name')}>
			<CollapsibleRoot open={!collapsed}>
				<CollapsibleContent data-horizontal>
					<Link to={`/list/${list.get('id')}`}>
						<div className={clsx(listThemeClass, classes.listTag)}>
							<Icon name="tag" className={classes.listTagIcon} />
							<span className={classes.listTagName}>{name}</span>
							<span className={classes.listTagNameSmall}>
								{getInitials(name)}
							</span>
						</div>
					</Link>
				</CollapsibleContent>
			</CollapsibleRoot>
		</Tooltip>
	);
}

function getInitials(name: string) {
	return name
		.split(' ')
		.map((word) => word[0])
		.join('');
}

function QuantityEditor({ item }: { item: Item }) {
	const { totalQuantity } = hooks.useWatch(item);
	const displayText = useItemDisplayText(item);
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="small" color="ghost">
					<Pencil1Icon />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Edit quantity</DialogTitle>
				<Box align="center" gap={4}>
					<span>{displayText}</span>
					<NumberStepper
						value={totalQuantity}
						onChange={(v) => item.set('totalQuantity', v)}
					/>
				</Box>
				<DialogActions>
					<DialogClose asChild>
						<Button align="end">Done</Button>
					</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
