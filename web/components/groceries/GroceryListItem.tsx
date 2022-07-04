import { forwardRef, ReactNode, useState } from 'react';
import { useSnapshot } from 'valtio';
import { GroceryItemData } from 'lib/stores/groceries';
import pluralize from 'pluralize';
import { Box } from 'components/primitives';
import { Checkbox, CheckboxIndicator } from 'components/primitives/Checkbox';
import { useDraggable } from '@dnd-kit/core';
import { keyframes, styled, theme } from 'stitches.config';
import { groceriesState } from './state';
import { DRAG_ACTIVATION_DELAY } from './constants';

export interface GroceryListItemProps {
	className?: string;
	item: GroceryItemData;
	isDragActive?: boolean;
}

export const GroceryListItem = forwardRef<HTMLDivElement, GroceryListItemProps>(
	function GroceryListItem({ item, isDragActive, ...rest }, ref) {
		const state = useSnapshot(item);
		const sectionStateSnap = useSnapshot(groceriesState);

		const isPurchased = state.purchasedQuantity >= state.totalQuantity;
		const isPartiallyPurchased = state.purchasedQuantity > 0;
		const pluralizedUnit = state.unit
			? state.totalQuantity === 1
				? state.unit
				: pluralize(state.unit)
			: '';
		const pluralizedName =
			state.totalQuantity === 1 ? state.name : pluralize(state.name);
		const displayString =
			state.mergedEntries.length === 1
				? state.mergedEntries[0].text
				: `${state.totalQuantity} ${
						pluralizedUnit && `${pluralizedUnit} `
				  }${pluralizedName}`;

		const [isPointerDown, setIsPointerDown] = useState(false);

		return (
			<ItemContainer
				hidden={sectionStateSnap.newCategoryPendingItem?.id === state.id}
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
							item.purchasedQuantity = 0;
						} else {
							item.purchasedQuantity = state.totalQuantity;
						}
					}}
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
		transform: 'scale(1)',
	},
	'10%': {
		boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
		transform: 'scale(1)',
	},
	'50%': {
		boxShadow: '$md',
		transform: 'scale(1)',
	},
	'80%': {
		transform: 'scale(1)',
	},
	'100%': {
		boxShadow: '$xl',
		transform: 'scale(1.1)',
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
				animation: `${DRAG_ACTIVATION_DELAY}ms $transitions$springy ${liftUp}`,
				// animationName: `${liftUp}`,
				zIndex: 1,
			},
			false: {
				animation: 'none',
			},
		},
		dragging: {
			true: {
				boxShadow: '$xl',
				transform: 'scale(1.1)',
				cursor: 'grabbing',
				touchAction: 'none',
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
	item: GroceryItemData;
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
				rx={theme.radii.lg.value}
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
	borderRadius: '$lg',
	overflow: 'hidden',
});

const StyledBox = styled('rect', {
	transition: `stroke-dashoffset ${
		DRAG_ACTIVATION_DELAY - 100
	}ms ease-out, stroke-dasharray ${DRAG_ACTIVATION_DELAY - 100}ms ease-out`,
	stroke: '$gray50',
});
