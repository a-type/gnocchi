import React, { forwardRef, ReactNode, useState } from 'react';
import { useSnapshot } from 'valtio';
import { Checkbox, CheckboxIndicator } from '../primitives/Checkbox';
import { useDraggable } from '@dnd-kit/core';
import { keyframes, styled, theme } from 'stitches.config';
import { groceriesState } from './state';
import { MOBILE_DRAG_ACTIVATION_DELAY } from './constants';
import GroceryItem from 'stores/groceries/.generated/GroceryItem';
import { unwrap, unwraps, useQuery } from '@aphro/react';
import { commit, UpdateType } from '@aphro/runtime-ts';
import GroceryItemMutations from 'stores/groceries/.generated/GroceryItemMutations';
import pluralize from 'pluralize';
import { Box } from 'components/primitives';

export interface GroceryListItemProps {
	className?: string;
	item: GroceryItem;
	isDragActive?: boolean;
}

function stopPropagation(e: React.MouseEvent | React.PointerEvent) {
	e.stopPropagation();
}

export const GroceryListItem = forwardRef<HTMLDivElement, GroceryListItemProps>(
	function GroceryListItem({ item, isDragActive, ...rest }, ref) {
		const sectionStateSnap = useSnapshot(groceriesState);
		const [inputs] = unwraps(
			useQuery(UpdateType.ANY, () => item.queryInputs(), []),
		);

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

		const [isPointerDown, setIsPointerDown] = useState(false);

		const updatePurchasedQuantity = (quantity: number) => {
			commit(item.ctx, [
				GroceryItemMutations.setPurchasedQuantity(item, {
					purchasedQuantity: quantity,
				}).toChangeset(),
			]);
		};

		return (
			<ItemContainer
				hidden={sectionStateSnap.newCategoryPendingItem?.id === item.id}
				{...rest}
				onPointerDown={() => setIsPointerDown(true)}
				onPointerUp={() => setIsPointerDown(false)}
				onPointerCancel={() => setIsPointerDown(false)}
				onPointerLeave={() => setIsPointerDown(false)}
				ref={ref}
				pickingUp={isPointerDown}
				dragging={isDragActive}
			>
				<Checkbox
					checked={
						isPurchased ? true : isPartiallyPurchased ? 'indeterminate' : false
					}
					onCheckedChange={(checked) => {
						if (isPurchased) {
							updatePurchasedQuantity(0);
						} else {
							updatePurchasedQuantity(item.totalQuantity);
						}
					}}
					// prevent click/tap from reaching draggable container -
					// don't disrupt a check action
					onMouseDown={stopPropagation}
					onMouseUp={stopPropagation}
					onPointerDown={stopPropagation}
					onPointerUp={stopPropagation}
				>
					<CheckboxIndicator />
				</Checkbox>
				<span>{displayString}</span>
				<AnimatedBorder active={isPointerDown} />
			</ItemContainer>
		);
	},
);

const liftUp = keyframes({
	'0%': {
		boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
	},
	'10%': {
		boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
	},
	'50%': {
		boxShadow: '$md',
	},
	'100%': {
		boxShadow: '$xl',
	},
});

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
	transform: 'scale(1)',
	userSelect: 'none',
	cursor: 'grab',

	transition: 'transform 0.2s $springy',

	variants: {
		hidden: {
			true: {
				visibility: 'hidden',
				pointerEvents: 'none',
			},
			false: {},
		},
		pickingUp: {
			true: {
				animation: `${MOBILE_DRAG_ACTIVATION_DELAY}ms $transitions$springy ${liftUp}`,
				zIndex: 1,
			},
			false: {
				animation: 'none',
			},
		},
		dragging: {
			true: {
				boxShadow: '$xl',
				cursor: 'grabbing',
				touchAction: 'none',
				border: '1px solid $colors$gray50',
			},
			false: {
				transform: 'scale(1)',
			},
		},
	},
});

export function GroceryListItemDraggable({
	item,
	...rest
}: {
	item: GroceryItem;
	children: ReactNode;
}) {
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id: item.id,
			data: item,
		});

	return (
		<Box
			{...attributes}
			{...listeners}
			ref={setNodeRef}
			style={{
				visibility: isDragging ? 'hidden' : 'visible',
			}}
			{...rest}
		/>
	);
}

/**
 * Animates an SVG path border to fill all the way around
 * during the animation.
 */
function AnimatedBorder({
	active,
	...rest
}: {
	active: boolean;
	className?: string;
}) {
	const strokeDashoffset = active ? 0 : -2000;

	return (
		<StyledSvg
			width="100%"
			height="100%"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			vectorEffect={'non-scaling-stroke'}
			{...rest}
		>
			<StyledBox
				width="100%"
				height="100%"
				rx={theme.radii.md.value}
				strokeWidth="3"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeDashoffset={strokeDashoffset}
				strokeDasharray={2000}
			/>
		</StyledSvg>
	);
}

const StyledSvg = styled('svg', {
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	pointerEvents: 'none',
	zIndex: 1,
	borderRadius: '$md',
	overflow: 'hidden',
});

const StyledBox = styled('rect', {
	transition: `stroke-dashoffset ${
		MOBILE_DRAG_ACTIVATION_DELAY - 100
	}ms ease-out, stroke-dasharray ${
		MOBILE_DRAG_ACTIVATION_DELAY - 100
	}ms ease-out`,
	stroke: '$gray50',
});
