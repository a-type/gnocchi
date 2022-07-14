import React, {
	ComponentPropsWithoutRef,
	CSSProperties,
	forwardRef,
	memo,
	ReactNode,
	Ref,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useSnapshot } from 'valtio';
import { Checkbox, CheckboxIndicator } from '../primitives/Checkbox';
import { CSS } from '@dnd-kit/utilities';
import { keyframes, styled, theme } from 'stitches.config';
import { groceriesState } from './state';
import { MOBILE_DRAG_ACTIVATION_DELAY } from './constants';
import GroceryItem from 'stores/groceries/.generated/GroceryItem';
import { useBind, useQuery } from '@aphro/react';
import { commit, UpdateType } from '@aphro/runtime-ts';
import GroceryItemMutations from 'stores/groceries/.generated/GroceryItemMutations';
import pluralize from 'pluralize';
import { Box, Button } from 'components/primitives';
import { useSortable } from '@dnd-kit/sortable';
import useMergedRef from '@react-hook/merged-ref';
import {
	DropdownMenu,
	DropdownMenuAnchor,
	DropdownMenuArrow,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from 'components/primitives/DropdownMenu';
import { DropdownMenuIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import {
	Popover,
	PopoverArrow,
	PopoverContent,
} from 'components/primitives/Popover';
import { PopoverAnchor } from '@radix-ui/react-popover';
import { useGroceryListCtx } from 'contexts/GroceryListContext';

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
		const sectionStateSnap = useSnapshot(groceriesState);
		const ctx = useGroceryListCtx();
		const { data: inputs } = useQuery(() => item.queryInputs(), []);

		useBind(item, ['purchasedQuantity', 'totalQuantity']);

		const isPurchased = item.purchasedQuantity >= item.totalQuantity;
		const isPartiallyPurchased = item.purchasedQuantity > 0;
		const pluralizedUnit = item.unit
			? item.totalQuantity === 1
				? item.unit
				: pluralize(item.unit)
			: '';
		const pluralizedName =
			item.totalQuantity === 1 ? item.name : pluralize(item.name);
		const displayString =
			inputs.length === 1
				? inputs[0].text
				: `${item.totalQuantity} ${
						pluralizedUnit && `${pluralizedUnit} `
				  }${pluralizedName}`;

		const updatePurchasedQuantity = useCallback(
			(quantity: number) => {
				commit(ctx, [
					GroceryItemMutations.setPurchasedQuantity(item, {
						purchasedQuantity: quantity,
					}).toChangeset(),
				]);
			},
			[ctx, item],
		);
		const togglePurchased = useCallback(() => {
			if (isPurchased) {
				updatePurchasedQuantity(0);
			} else {
				updatePurchasedQuantity(item.totalQuantity);
			}
		}, [updatePurchasedQuantity, isPurchased, item]);

		return (
			<ItemContainer
				hidden={sectionStateSnap.newCategoryPendingItem?.id === item.id}
				{...rest}
				ref={ref}
				dragging={isDragActive}
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
				>
					<CheckboxIndicator />
				</Checkbox>
				<Box flex={1}>{displayString}</Box>
				<GroceryListItemMenu item={item} {...menuProps} />
			</ItemContainer>
		);
	},
);

const ItemContainer = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	gap: '$2',
	backgroundColor: '$white',
	borderRadius: '$md',
	padding: '$3',
	position: 'relative',
	animation: 'none',
	userSelect: 'none',

	transition: 'all 0.2s $springy',

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
	},
});

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
		id: item.id,
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
			ref: setActivatorNodeRef,
		}),
		[listeners, attributes, setActivatorNodeRef],
	);

	const transformString = CSS.Transform.toString(transform);
	const style = useMemo(
		() => ({
			transform: transformString,
			opacity: isDragging ? 0.2 : 1,
			touchAction: 'none',
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

interface GroceryListItemMenuProps
	extends ComponentPropsWithoutRef<typeof Button> {
	item: GroceryItem;
}
const GroceryListItemMenu = memo(
	forwardRef<HTMLButtonElement, GroceryListItemMenuProps>(
		function GroceryListItemMenu({ item, ...props }, ref) {
			const deleteItem = () => {
				item.delete().save();
			};

			const [menuOpen, setMenuOpen] = useState(false);

			const menuId = `grocery-list-item-menu-${item.id}`;

			return (
				<Popover
					modal
					open={menuOpen}
					onOpenChange={(isOpen) => {
						console.log('onOpenChange', isOpen);
						if (!isOpen) setMenuOpen(false);
						// ignore open true
					}}
				>
					<PopoverAnchor asChild>
						<Button
							aria-haspopup="menu"
							aria-expanded={menuOpen ? true : undefined}
							data-state={menuOpen ? 'open' : undefined}
							aria-controls={menuId}
							color="ghost"
							onPointerUp={(event) => {
								// don't activate the menu if an item was dragged during this gesture
								if (groceriesState.isAnyItemDragged) {
									return;
								}

								if (event.button === 0 && event.ctrlKey === false) {
									setMenuOpen(true);
									event.preventDefault();
								}
							}}
							onKeyDown={(event) => {
								if (['Enter', ' '].includes(event.key)) {
									setMenuOpen((v) => !v);
								}
								if (event.key === 'ArrowDown') {
									setMenuOpen(true);
								}
								// prevent scrolling
								if ([' ', 'ArrowDown'].includes(event.key)) {
									event.preventDefault();
								}
							}}
							{...props}
							ref={ref}
						>
							<HamburgerMenuIcon />
						</Button>
					</PopoverAnchor>
					<PopoverContent id={menuId}>
						<PopoverArrow />
						<Button
							css={{ width: '$full' }}
							color="ghostDestructive"
							onClick={deleteItem}
						>
							Delete
						</Button>
					</PopoverContent>
				</Popover>
			);
		},
	),
);
GroceryListItemMenu.displayName = 'GroceryListItemMenu';
