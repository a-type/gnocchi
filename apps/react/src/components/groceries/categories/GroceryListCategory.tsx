import {
	CollapsibleContent,
	CollapsibleRoot,
} from '@/components/primitives/Collapsible.jsx';
import { Button } from '@/components/primitives/primitives.jsx';
import { PersonAvatar } from '@/components/sync/people/PersonAvatar.jsx';
import { useIsSubscribed } from '@/contexts/AuthContext.jsx';
import useMergedRef from '@/hooks/useMergedRef.js';
import { Category, hooks, Item } from '@/stores/groceries/index.js';
import { vars } from '@/theme.css.js';
import { useDndMonitor, useDroppable } from '@dnd-kit/core';
import { clsx } from 'clsx';
import { memo, useCallback, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { useIsDragging } from '../dndHooks.js';
import { GroceryListItemDraggable } from '../items/GroceryListItem.js';
import { groceriesState } from '../state.js';
import * as classes from './GroceryListCategory.css.js';

const EMPTY_DROPPABLE_SIZE = 48;

export function GroceryListCategory({
	category,
	items,
	...rest
}: {
	category: Category | null;
	items: Item[];
}) {
	const recentlyPurchased = useSnapshot(groceriesState.recentlyPurchasedItems);
	const visibleItems = items.filter((item) => {
		return !item.get('purchasedAt') || recentlyPurchased.has(item.get('id'));
	});
	const empty = visibleItems.length === 0;

	const isDragging = useIsDragging();
	const internalRef = useRef<HTMLDivElement>(null);

	useDragExpansion({ internalRef, empty });

	const { setNodeRef, isOver } = useDroppable({
		id: category?.get('id') || 'null',
		data: {
			type: 'category',
			value: category?.get('id'),
		},
	});

	const finalRef = useMergedRef(internalRef, setNodeRef);

	return (
		<div
			className={clsx('groceryCategory', classes.root)}
			data-dragged-over={isOver}
			data-is-item-dragging={isDragging}
			data-is-empty={empty}
			ref={finalRef}
			{...rest}
		>
			<div className={classes.titleRow}>
				<h2 className={classes.title}>
					{category?.get('name') ?? 'Uncategorized'}
				</h2>
				{category && (
					<div className={classes.claimGroup}>
						<CategoryClaim category={category} />
					</div>
				)}
			</div>
			<div className={classes.items} data-is-item-dragging={isDragging}>
				{visibleItems.map((item, index) => {
					const prevItem = visibleItems[index - 1];
					const nextItem = visibleItems[index + 1];
					return (
						<MemoizedDraggableItem
							key={item.get('id')}
							item={item}
							nextSortKey={nextItem?.get('sortKey') || null}
							prevSortKey={prevItem?.get('sortKey') || null}
						/>
					);
				})}
			</div>
		</div>
	);
}

function waitForAnimationCancel(animation: Animation) {
	return new Promise((resolve) => {
		animation.cancel();
		animation.addEventListener('cancel', resolve);
	});
}

const animationTiming = 200;
/**
 * Controls the animation of expanding and collapsing hidden categories
 * while the user is dragging
 */
function useDragExpansion({
	internalRef,
	empty,
}: {
	internalRef: React.RefObject<HTMLDivElement>;
	empty: boolean;
}) {
	const heightPriorToDragRef = useRef(0);
	const priorAnimationRef = useRef<Animation>();

	const collapse = useCallback(async () => {
		const element = internalRef.current;
		if (!element) return;

		priorAnimationRef.current?.cancel();

		for (const animation of element.getAnimations()) {
			await waitForAnimationCancel(animation);
		}

		element.animate(
			[
				{
					opacity: 1,
					height: `${EMPTY_DROPPABLE_SIZE}px`,
				},
				{
					opacity: empty ? 0 : 1,
					height: `${empty ? 0 : heightPriorToDragRef.current}px`,
				},
			],
			{
				duration: animationTiming,
				iterations: 1,
				easing: 'ease-in-out',
				fill: 'auto',
			},
		);
	}, [empty, internalRef]);

	useDndMonitor({
		onDragStart: () => {
			const element = internalRef.current;
			if (!element) return;

			heightPriorToDragRef.current = element.clientHeight;

			priorAnimationRef.current = element.animate(
				[
					{
						height: `${element.clientHeight}px`,
						opacity: empty ? 0 : 1,
						marginBottom: empty ? 0 : vars.space[4],
					},
					{
						height: `${EMPTY_DROPPABLE_SIZE}px`,
						opacity: 1,
						marginBottom: vars.space[4],
					},
				],
				{
					duration: animationTiming,
					iterations: 1,
					easing: 'ease-in-out',
					fill: 'forwards',
				},
			);
		},
		onDragEnd: collapse,
		onDragCancel: collapse,
	});
}

const MemoizedDraggableItem = memo(GroceryListItemDraggable);

const CategoryClaim = memo(function CategoryClaim({
	category,
}: {
	category: Category;
}) {
	const claimer = useCategoryClaimPresence(category);
	const me = hooks.useSelf();
	const isMyClaim = claimer?.id === me.id;

	const claim = useCallback(() => {
		if (isMyClaim) {
			category.set('claim', null);
		} else {
			category.set('claim', {
				claimedBy: me.id,
				claimedAt: Date.now(),
			});
		}
	}, [me.id, isMyClaim]);

	const isSubscribed = useIsSubscribed();

	if (!isSubscribed) {
		return null;
	}

	return (
		<Button
			color="ghost"
			size="small"
			className={classes.claimButton}
			onClick={claim}
		>
			<CollapsibleRoot open={!!claimer}>
				<CollapsibleContent data-horizontal className={classes.claimCollapse}>
					<span className={classes.claimLabel}>claimed</span>
					{!!claimer ? (
						<PersonAvatar className={classes.claimAvatar} person={claimer} />
					) : (
						<div className={classes.claimAvatarSpacer} />
					)}
				</CollapsibleContent>
			</CollapsibleRoot>
			<ClaimIcon active={!!claimer} />
		</Button>
	);
});

// TODO: elevate this to a reusable hook in lo-fi?
function useCategoryClaimPresence(category: Category) {
	const { claim } = hooks.useWatch(category);
	const self = hooks.useSelf();
	const peer = hooks.usePeer(claim?.get('claimedBy') ?? null);
	const user = self.id === claim?.get('claimedBy') ? self : peer;
	// only return claims in the last day
	if (!claim || claim?.get('claimedAt') < Date.now() - 1000 * 60 * 60 * 24) {
		return null;
	}
	return user;
}

function ClaimIcon({ active }: { active?: boolean }) {
	return (
		<svg
			width="15"
			height="15"
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M8.5 14.5L10.6429 4.99999M10.6429 4.99999L11.5 0.999986C11.5 0.999986 9 1.99999 7.5 0.999986C6 -1.35601e-05 3.5 0.999986 3.5 0.999986L3 4.99999C3 4.99999 5 3.49999 6.8258 4.60521C8.6516 5.71043 10.6429 4.99999 10.6429 4.99999Z"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={clsx(classes.claimIcon, {
					[classes.claimIconActive]: active,
				})}
			/>
		</svg>
	);
}