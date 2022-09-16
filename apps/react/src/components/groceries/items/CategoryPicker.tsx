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
import { GroceryItem, hooks } from '@/stores/groceries/index.js';
import { useAnimationFrame } from '@/hooks/useAnimationFrame.js';

const SCROLL_DEADZONE = 20;
const SCROLL_MAX = 100;
const SCROLL_MULTIPLIER = 0.5;

export function CategoryPicker({ item }: { item: GroceryItem }) {
	hooks.useWatch(item);
	const [open, setOpen] = useState(false);

	const isScrubbingRef = useRef(false);

	const setCategory = useCallback(
		(categoryId: string) => {
			item.$update({ categoryId });
		},
		[item],
	);

	const [{ offset }, spring] = useSpring(() => ({
		offset: 0,
	}));

	const gestureOffsetRef = useRef(0);

	useAnimationFrame(
		(deltaTime) => {
			if (gestureOffsetRef.current) {
				console.log(gestureOffsetRef.current);
				spring.start({ offset: offset.get() - gestureOffsetRef.current });
			}
		},
		[spring],
	);

	const bind = g.useGesture({
		onDragStart: () => {
			setOpen(true);
		},
		onDrag: (state: { offset: [number, number] }) => {
			isScrubbingRef.current = true;
			if (Math.abs(state.offset[1]) > SCROLL_DEADZONE) {
				gestureOffsetRef.current =
					SCROLL_MULTIPLIER *
					Math.max(-SCROLL_MAX, Math.min(state.offset[1], SCROLL_MAX));
			} else {
				gestureOffsetRef.current = 0;
			}
		},
		onDragEnd: ({ tap }: { tap: boolean }) => {
			isScrubbingRef.current = false;
			gestureOffsetRef.current = 0;
			spring.start({ offset: 0 });
			if (!tap) {
				setOpen(false);
			}
		},
	}) as () => any;

	return (
		<Popover
			open={open}
			onOpenChange={(val) => {
				if (isScrubbingRef.current) return;
				setOpen(val);
			}}
		>
			<PopoverAnchor asChild>
				<Trigger {...bind()} />
			</PopoverAnchor>
			<PopoverContent side="left" sideOffset={2}>
				<PopoverArrow />
				<LoopingCategoryList
					offset={offset}
					value={item.categoryId}
					onChange={setCategory}
				/>
			</PopoverContent>
		</Popover>
	);
}

const Trigger = styled(RowSpacingIcon, {
	touchAction: 'none',
});

function LoopingCategoryList({
	offset,
	value,
	onChange,
}: {
	offset: SpringValue<number>;
	value: string;
	onChange: (value: string) => void;
}) {
	const categories = hooks.useAllCategories();

	const height = Math.min(600, Math.max(categories.length * 40, 200));

	return (
		<LoopingWindow css={{ height }}>
			<LoopingView
				style={{ transform: offset.to((o) => `translateY(${o}px)`) }}
			>
				{categories.map((category) => (
					<CategoryItem
						onClick={() => onChange(category.id)}
						selected={category.id === value}
					>
						{category.name}
					</CategoryItem>
				))}
			</LoopingView>
		</LoopingWindow>
	);
}

const LoopingWindow = styled('div' as const, {
	overflow: 'hidden',
});

const LoopingView = styled(animated.div, {});

const CategoryItem = styled('div' as const, {
	height: 40,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',

	variants: {
		selected: {
			true: {
				backgroundColor: '$lemonLighter',
			},
		},
	},
});
