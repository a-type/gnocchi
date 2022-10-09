import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RowSpacingIcon } from '@radix-ui/react-icons';
import { styled } from '@/stitches.config.js';
import * as g from '@use-gesture/react';
import {
	Popover,
	PopoverArrow,
	PopoverContent,
} from '../../primitives/Popover.js';
import { PopoverAnchor } from '@radix-ui/react-popover';
import { animated, SpringValue, useSpring } from '@react-spring/web';
import {
	groceries,
	GroceryCategory,
	GroceryItem,
	hooks,
} from '@/stores/groceries/index.js';
import { useAnimationFrame } from '@/hooks/useAnimationFrame.js';
import { Dialog, DialogContent } from '@/components/primitives/Dialog.js';
import { NewCategoryForm } from '../NewCategoryForm.js';

const SCROLL_DEADZONE = 20;
const SCROLL_MAX = 100;
const SCROLL_MULTIPLIER = 0.5;
const ITEM_HEIGHT = 32;

function scrollPositionToCategory(
	scrollPosition: number,
	categories: GroceryCategory[],
) {
	const totalWrapHeight = (categories.length + 1) * ITEM_HEIGHT;
	let adjustedScrollPosition = scrollPosition;
	// add total list length to value until it's positive
	while (adjustedScrollPosition < 0) {
		adjustedScrollPosition += totalWrapHeight;
	}
	let rawIndex = Math.floor(adjustedScrollPosition / ITEM_HEIGHT);
	// the item at categories.length is "New Category"
	// after that it wraps around
	const realIndex = rawIndex % (categories.length + 1);
	if (realIndex >= categories.length) {
		return 'new';
	}
	return categories[realIndex].get('id');
}

export function CategoryPicker({ item }: { item: GroceryItem }) {
	hooks.useWatch(item);
	const [state, setState] = useState<
		'idle' | 'scrubbing' | 'picking' | 'create'
	>('idle');

	const viewRef = useRef<HTMLDivElement>(null);
	const isScrubbingRef = useRef(false);

	const categories = hooks.useAllCategories();
	const itemCategoryIndex = categories.findIndex(
		(category) => category.get('id') === item.get('categoryId'),
	);
	const startingOffset = itemCategoryIndex * ITEM_HEIGHT;
	const totalWrapHeight = (categories.length + 1) * ITEM_HEIGHT;
	const height = Math.min(100, Math.max(categories.length * ITEM_HEIGHT, 400));

	const setCategory = useCallback(
		(categoryId: string) => {
			groceries.setItemCategory(item, categoryId);
		},
		[item],
	);

	const [{ offset }, spring] = useSpring(() => ({
		offset: startingOffset,
	}));

	const gestureOffsetRef = useRef(0);

	const [scrubbedSelection, setScrubbedSelection] = useState<string | null>(
		null,
	);

	// scrolling of the viewport
	useAnimationFrame(
		(deltaTime) => {
			if (gestureOffsetRef.current && isScrubbingRef.current) {
				const scrollPosition = offset.get();
				spring.start({ offset: scrollPosition - gestureOffsetRef.current });
				setScrubbedSelection(
					scrollPositionToCategory(scrollPosition + height / 2, categories),
				);
			}
		},
		[spring, offset, height],
	);
	// looping positions of items happens whenever the viewport is visible
	useAnimationFrame(() => {
		const container = viewRef.current;
		if (!container) return;

		const categoryElements = container.querySelectorAll(
			'[data-category-index]',
		);

		if (isScrubbingRef.current) {
			const scrollPosition = offset.get();
			const windowStart = scrollPosition;
			const windowEnd = scrollPosition + height;
			// find any categories which are no longer visible and move them into view
			for (let i = 0; i < categoryElements.length; i++) {
				const categoryElement = categoryElements[i] as HTMLElement;
				const visibleTop = categoryElement.offsetTop;
				const topCssValue = parseInt(categoryElement.style.top) || 0;
				if (visibleTop > windowEnd) {
					categoryElement.style.setProperty(
						'top',
						`${topCssValue - totalWrapHeight}px`,
					);
				} else if (visibleTop + ITEM_HEIGHT < windowStart) {
					categoryElement.style.setProperty(
						'top',
						`${topCssValue + totalWrapHeight}px`,
					);
				}
			}
		} else {
			categoryElements.forEach((categoryElement) => {
				(categoryElement as HTMLElement).style.removeProperty('top');
			});
		}
	}, [height, offset, totalWrapHeight]);

	const bind = g.useGesture({
		onDragStart: () => {
			setState('scrubbing');
			spring.set({
				offset: startingOffset + height / 2,
			});
		},
		onDrag: (state: { offset: [number, number] }) => {
			if (Math.abs(state.offset[1]) > SCROLL_DEADZONE) {
				isScrubbingRef.current = true;
				gestureOffsetRef.current =
					-1 *
					SCROLL_MULTIPLIER *
					Math.max(-SCROLL_MAX, Math.min(state.offset[1], SCROLL_MAX));
			} else {
				gestureOffsetRef.current = 0;
			}
		},
		onDragEnd: ({ tap }: { tap: boolean }) => {
			isScrubbingRef.current = false;
			gestureOffsetRef.current = 0;
			if (!tap) {
				// select highlighted value and close
				if (scrubbedSelection === 'new') {
					setState('create');
				} else if (scrubbedSelection) {
					setCategory(scrubbedSelection);
					setState('idle');
				} else {
					setState('idle');
				}
			} else {
				setState('picking');
			}
			setScrubbedSelection(null);
		},
	}) as () => any;

	const onCreateCategory = ({ id }: { id: string }) => {
		item.set('categoryId', id);
		setState('idle');
	};

	return (
		<>
			<Popover
				open={state !== 'idle' && state !== 'create'}
				onOpenChange={(val) => {
					if (isScrubbingRef.current) return;
					setState(val ? 'picking' : 'idle');
				}}
			>
				<PopoverAnchor asChild>
					<Trigger {...bind()} />
				</PopoverAnchor>
				<PopoverContent side="left" sideOffset={2}>
					<PopoverArrow />
					<LoopingWindow
						css={{ height, overflowY: state === 'picking' ? 'auto' : 'hidden' }}
					>
						<LoopingView
							ref={viewRef}
							style={{
								transform: offset.to((o) => {
									if (isScrubbingRef.current) {
										return `translateY(${-o}px)`;
									}
									return 'none';
								}),
							}}
						>
							{categories.map((category, index) => (
								<CategoryItem
									key={category.get('id')}
									data-category-index={index}
									onClick={() => setCategory(category.get('id'))}
									selected={category.get('id') === item.get('categoryId')}
									css={{
										backgroundColor:
											category.get('id') === scrubbedSelection
												? 'rgba(0,0,0,0.1)'
												: 'transparent',
										transform:
											category.get('id') === scrubbedSelection
												? `scale(1)`
												: `scale(0.9)`,
									}}
								>
									{category.get('name')}
								</CategoryItem>
							))}
							<CategoryItem
								key="new"
								data-category-index={categories.length}
								onClick={() => {
									setState('create');
								}}
								selected={false}
								css={{
									backgroundColor:
										'new' === scrubbedSelection
											? 'rgba(0,0,0,0.1)'
											: 'transparent',

									transform:
										'new' === scrubbedSelection ? `scale(1)` : `scale(0.9)`,
								}}
							>
								Create new category
							</CategoryItem>
						</LoopingView>
					</LoopingWindow>
				</PopoverContent>
			</Popover>
			<CreateCategory
				onCreate={onCreateCategory}
				open={state === 'create'}
				onOpenChange={(v) => {
					if (!v) setState('idle');
				}}
			/>
		</>
	);
}

const Trigger = styled(RowSpacingIcon, {
	touchAction: 'none',
});

const LoopingWindow = styled('div' as const, {
	overflow: 'hidden',
});

const LoopingView = styled(animated.div, {
	position: 'relative',
});

const CategoryItem = styled('div' as const, {
	height: ITEM_HEIGHT,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	position: 'relative',
	borderRadius: '$sm',
	padding: '$1 $2',

	transition: 'transform 0.2s ease-out, background-color 0.2s ease-out',

	variants: {
		selected: {
			true: {
				color: '$lemonDark',
			},
		},
	},
});

const SelectorArrow = styled(PopoverArrow, {});

function CreateCategory({
	onCreate,
	...rest
}: {
	onCreate: (category: { id: string }) => void;
	open: boolean;
	onOpenChange: (v: boolean) => void;
}) {
	return (
		<Dialog {...rest}>
			<DialogContent>
				<NewCategoryForm onDone={onCreate} autoFocus />
			</DialogContent>
		</Dialog>
	);
}
