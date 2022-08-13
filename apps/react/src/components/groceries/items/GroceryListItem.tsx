import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { PopoverAnchor } from '@radix-ui/react-popover';
import { Box, Button } from 'components/primitives';
import {
	Popover,
	PopoverArrow,
	PopoverContent,
} from 'components/primitives/Popover';
import { useIsFirstRender } from 'hooks/usePrevious';
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
import { styled } from 'stitches.config';
import { GroceryItem } from '@aglio/data';
import { useSnapshot } from 'valtio';
import { Checkbox } from '../../primitives/Checkbox';
import { groceriesState } from '../state';
import { ItemQuantityNumber } from './ItemQuantityNumber';
import { groceries, useBind, useQuery } from 'stores/groceries';

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
		const inputs = useQuery(() => item.queryInputs(), {
			key: `inputs-${item.id}`,
		});

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
		const showOnlyInput = inputs.length === 1;
		const displayString = showOnlyInput
			? inputs[0].text
			: `${pluralizedUnit && `${pluralizedUnit} `}${pluralizedName}`;

		const togglePurchased = useCallback(() => {
			return groceries.toggleItemPurchased(item);
		}, [item]);

		const quantityJustChanged = useDidQuantityJustChange(item);

		return (
			<ItemContainer
				hidden={sectionStateSnap.newCategoryPendingItem?.id === item.id}
				{...rest}
				ref={ref}
				highlighted={quantityJustChanged}
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
				/>
				<Box direction="row" gap={1} flex={1}>
					{!showOnlyInput && <ItemQuantityNumber value={item.totalQuantity} />}
					{displayString}
				</Box>
				<GroceryListItemMenu item={item} {...menuProps} />
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
	}, [item.totalQuantity, isFirstRenderRef]);

	return didQuantityChange;
}

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
	},
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
