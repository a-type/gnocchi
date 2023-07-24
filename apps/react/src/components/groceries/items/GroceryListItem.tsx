import { FoodDetailDialog } from '@/components/foods/FoodDetailDialog.jsx';
import { Icon } from '@/components/icons/Icon.jsx';
import { Link } from '@/components/nav/Link.jsx';
import { OnboardingTooltip } from '@/components/onboarding/OnboardingTooltip.jsx';
import { useParticles } from '@aglio/ui/components/particles';
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
import { Button, ButtonProps } from '@aglio/ui/components/button';
import { Checkbox } from '@aglio/ui/components/checkbox';
import {
	CollapsibleContent,
	CollapsibleRoot,
	CollapsibleTrigger,
} from '@aglio/ui/components/collapsible';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@aglio/ui/components/dialog';
import { LiveUpdateTextField } from '@aglio/ui/components/liveUpdateTextField';
import { NumberStepper } from '@aglio/ui/components/numberStepper';
import { Tooltip } from '@aglio/ui/components/tooltip';
import { useSizeCssVars } from '@aglio/ui/hooks';
import { CSS } from '@dnd-kit/utilities';
import { UserInfo } from '@verdant-web/store';
import {
	ClockIcon,
	DragHandleDots1Icon,
	DragHandleDots2Icon,
	HamburgerMenuIcon,
	Pencil1Icon,
	TrashIcon,
} from '@radix-ui/react-icons';
import classNames from 'classnames';
import React, {
	CSSProperties,
	Ref,
	Suspense,
	forwardRef,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useSnapshot } from 'valtio';
import { ListSelect } from '../lists/ListSelect.jsx';
import { useListOrNull, useListThemeClass } from '../lists/hooks.js';
import { groceriesState } from '../state.js';
import { ItemDeleteButton } from './ItemDeleteButton.js';
import { useItemDisplayText } from './hooks.js';
import { ItemSources } from '@/components/groceries/items/ItemSources.jsx';
import { useDraggable } from '@dnd-kit/core';
import { preventDefault, stopPropagation } from '@aglio/tools';
import { OpenFoodDetailButton } from '@/components/foods/OpenFoodDetailButton.jsx';
import { useExpiresText, usePurchasedText } from '@/components/pantry/hooks.js';

export interface GroceryListItemProps {
	className?: string;
	item: Item;
	isDragActive?: boolean;
	style?: CSSProperties;
	menuProps?: any;
	first?: boolean;
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
				className={classNames(
					'item',
					'grid grid-areas-[check_main]-[check_comment]-[secondary_secondary] grid-cols-[min-content_1fr_min-content] grid-rows-[min-content_min-content_min-content]',
					'w-full bg-wash rounded-md relative select-none transition ease-springy',
					'repeated:mt-1',
					'[&[data-dragging=true]]:(shadow-xl cursor-grabbing touch-none border-light)',
					'[&[data-highlighted=true]]:bg-primary-wash',
					'[&[data-menu-open=true]]:(bg-white border-light)',
					'[&[data-just-moved=true][data-hidden-state=visible]]:(animate-keyframes-pop-up animate-duration-400)',
					'[&[data-hidden-state=hidden]]:(animate-item-disappear animate-mode-forwards)',
					className,
				)}
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
				<ItemCheckbox
					isPurchased={isPurchased}
					isPartiallyPurchased={isPartiallyPurchased}
					togglePurchased={togglePurchased}
				/>
				<CollapsibleTrigger asChild>
					<div className="flex flex-row items-start gap-2 [grid-area:main] pt-2 pr-3 pb-2 relative cursor-pointer focus:(shadow-focus)">
						<div className="flex flex-col gap-2 items-start flex-1">
							<div className="flex flex-row items-start gap-1 mt-1 max-w-full overflow-hidden text-ellipsis relative">
								<span>{displayString}</span>
								{menuOpen && (
									<QuantityEditor className="relative top--1" item={item} />
								)}
							</div>
							{isPurchased && (
								<div className="absolute left-0 right-52px top-20px border-0 border-b border-b-gray5 border-solid h-1px transform-origin-left animate-expand-scale-x animate-duration-100 animate-ease-out" />
							)}
							{comment && !menuOpen && (
								<div className="text-xs text-gray7 italic [grid-area:comment]">
									{comment}
								</div>
							)}
						</div>
						<Suspense>
							<RecentPurchaseHint compact className="mt-1" foodName={food} />
						</Suspense>
						<RecentPeople item={item} />
						<ListTag item={item} collapsed={menuOpen} />
						<div
							onTouchStart={stopPropagation}
							onTouchMove={stopPropagation}
							onTouchEnd={stopPropagation}
							onPointerDown={stopPropagation}
							onPointerMove={stopPropagation}
							onPointerUp={stopPropagation}
						>
							<div
								className="relative py-1 px-2"
								// onContextMenu={preventDefault}
								{...menuProps}
							>
								{first ? (
									<OnboardingTooltip
										onboarding={categorizeOnboarding}
										step="categorize"
										content="Tap and hold to change category"
										disableNext
									>
										<DragHandleDots2Icon />
									</OnboardingTooltip>
								) : (
									<DragHandleDots2Icon />
								)}
							</div>
						</div>
					</div>
				</CollapsibleTrigger>
				<CollapsibleContent className="[grid-area:secondary]">
					<Suspense>
						<div className="flex flex-col gap-2 justify-end p-3 pt-0 items-end">
							<ItemSources item={item} />

							<div className="flex flex-row gap-3 flex-wrap justify-end w-full items-center">
								<LiveUpdateTextField
									value={comment || ''}
									onChange={(val) => item.set('comment', val)}
									placeholder="Add a comment"
									className="important:text-xs important:border-gray5 flex-grow-2 flex-shrink-1 flex-basis-50% md:flex-basis-120px"
								/>
								<ListSelect
									value={item.get('listId')}
									onChange={(listId) => item.set('listId', listId)}
									className="flex-basis-25% flex-grow-1 flex-shrink-1 md:flex-basis-80px"
								/>
								<Suspense>
									<RecentPurchaseHint foodName={food} />
								</Suspense>
								{/* <OpenFoodDetailButton foodName={food} /> */}
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
			style: {
				cursor: isDragging ? 'grabbing' : 'grab',
				touchAction: 'none',
			},
			ref: setActivatorNodeRef,
		}),
		[listeners, attributes, setActivatorNodeRef, isDragging],
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
						className="relative z-[var(--index)] left-[calc(var(--index)*-8px)]"
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
				<CollapsibleContent
					data-horizontal
					className="rounded-md focus-within:(outline-none shadow-focus)"
				>
					<Link
						to={`/list/${list.get('id')}`}
						className="focus-visible:outline-none"
					>
						<div
							className={classNames(
								listThemeClass,
								'flex items-center justify-center p-1 color-black rounded-md bg-primary-light text-xs min-w-3 min-h-3 gap-1 lg:px-2',
							)}
						>
							<Icon name="tag" className="inline" />
							<span className="display-none whitespace-nowrap overflow-hidden text-ellipsis max-w-full lg:inline">
								{name}
							</span>
							<span className="inline whitespace-nowrap overflow-hidden text-ellipsis max-w-full lg:display-none">
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

function QuantityEditor({
	item,
	className,
}: {
	item: Item;
	className?: string;
}) {
	const { totalQuantity, textOverride } = hooks.useWatch(item);
	const displayText = useItemDisplayText(item);
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					size="icon"
					className={classNames('p-1', className)}
					color="ghost"
				>
					<Pencil1Icon />
				</Button>
			</DialogTrigger>
			<DialogContent onOpenAutoFocus={preventDefault}>
				<DialogTitle>Edit item</DialogTitle>
				<div className="flex flex-row items-center gap-4">
					<LiveUpdateTextField
						placeholder={displayText}
						value={textOverride || ''}
						onChange={(v) => item.set('textOverride', v)}
					/>
					<NumberStepper
						value={totalQuantity}
						onChange={(v) => item.set('totalQuantity', v)}
					/>
				</div>
				<DialogActions>
					<DialogClose asChild>
						<Button align="end">Done</Button>
					</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}

function ItemCheckbox({
	isPurchased,
	isPartiallyPurchased,
	togglePurchased,
}: {
	isPurchased: boolean;
	isPartiallyPurchased: boolean;
	togglePurchased: () => void;
}) {
	const ref = useRef<HTMLButtonElement>(null);
	const particles = useParticles();

	useEffect(() => {
		if (isPurchased && ref.current) {
			particles?.addParticles(
				particles.elementExplosion({
					element: ref.current,
					count: 20,
				}),
			);
		}
	}, [isPurchased]);

	return (
		<Checkbox
			ref={ref}
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
			className="[grid-area:check] mt-2 mx-3"
		/>
	);
}

function useFood(foodName: string) {
	return hooks.useOneFood({
		index: {
			where: 'anyName',
			equals: foodName,
		},
	});
}

function RecentPurchaseHint({
	foodName,
	compact,
	className,
}: {
	foodName: string;
	compact?: boolean;
	className?: string;
}) {
	const food = useFood(foodName);
	hooks.useWatch(food);

	if (!food) {
		return null;
	}

	const lastPurchasedAt = food.get('lastPurchasedAt');
	// default to 1 week for non-perishables
	const expiresAfterDays = food.get('expiresAfterDays') ?? 7;

	const purchasedText = usePurchasedText(food, true);

	// only show small version if the food was purchased less than expiresAfterDays ago
	if (
		compact &&
		(!lastPurchasedAt ||
			Date.now() - lastPurchasedAt > expiresAfterDays * 24 * 60 * 60 * 1000)
	) {
		return null;
	}

	if (compact) {
		return (
			<Tooltip content={purchasedText}>
				<ClockIcon className={classNames('color-primary-dark', className)} />
			</Tooltip>
		);
	}

	// only show the large version if it was purchased at all
	if (!lastPurchasedAt) return null;

	return (
		<div
			className={classNames(
				'text-xs text-gray-7 italic flex flex-row gap-1 items-center',
				className,
			)}
		>
			<ClockIcon />
			<span>{purchasedText}</span>
		</div>
	);
}
