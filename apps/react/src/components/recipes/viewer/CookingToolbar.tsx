import { Recipe } from '@aglio/groceries-client';
import { ListBulletIcon } from '@radix-ui/react-icons';
import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import classNames from 'classnames';
import { Suspense, useCallback, useRef, useState } from 'react';
import * as classes from './CookingToolbar.css.js';
import { IngredientCheckoffView } from './IngredientCheckoffView.jsx';
import { RecipeMultiplierField } from './RecipeMultiplierField.jsx';
import { Icon } from '@/components/icons/Icon.jsx';
import { PageNowPlaying } from '@aglio/ui/components/layouts';
import { Button } from '@aglio/ui/components/button';
import { sprinkles } from '@aglio/ui/styles';
import { H5 } from '@aglio/ui/components/typography';
import {
	CollapsibleContent,
	CollapsibleRoot,
	CollapsibleTrigger,
} from '@aglio/ui/src/components/collapsible';
import { useNowPlayingRecipes } from '@/components/recipes/nowPlaying/hooks.js';
import { RecipeNowPlayingLink } from '@/components/recipes/nowPlaying/RecipeNowPlayingLink.jsx';

export interface CookingToolbarProps {
	recipe: Recipe;
}

const PEEK_HEIGHT = 150;
const MAX_HEIGHT = 400;

export function CookingToolbar({ recipe }: CookingToolbarProps) {
	const [nowPlayingOpen, setNowPlayingOpen] = useState(false);
	const closeNowPlaying = useCallback(() => setNowPlayingOpen(false), []);
	const {
		containerRef,
		containerStyle,
		bind,
		close: closeInfo,
	} = useExpandingContainer(closeNowPlaying);

	const { otherRecipes } = useNowPlayingRecipes();
	const showNowPlaying = false;

	const onNowPlayingOpenChange = useCallback(
		(open: boolean) => {
			setNowPlayingOpen(open);
			if (open) closeInfo();
		},
		[closeInfo],
	);

	return (
		<CollapsibleRoot
			open={nowPlayingOpen}
			onOpenChange={onNowPlayingOpenChange}
		>
			<PageNowPlaying unstyled className={classes.root}>
				<div className={classes.actions}>
					<Button className={classes.toggleButton} {...bind()}>
						<animated.span
							style={{
								display: containerStyle.height.to((h) =>
									h > 0 ? 'none' : 'block',
								),
							}}
						>
							<ListBulletIcon />
						</animated.span>
						<animated.span
							style={{
								display: containerStyle.height.to((h) =>
									h > 0 ? 'block' : 'none',
								),
							}}
						>
							<Icon name="drag_vertical" />
						</animated.span>
					</Button>
					{showNowPlaying && (
						<CollapsibleTrigger asChild>
							<Button className={classes.toggleButton}>
								+ {otherRecipes.length}
							</Button>
						</CollapsibleTrigger>
					)}
				</div>

				<animated.div
					ref={containerRef}
					className={classNames(classes.container)}
					style={{
						height: containerStyle.height,
						border: containerStyle.height.to((h) =>
							h > 0 ? '1px solid currentColor' : 'none',
						),
					}}
				>
					<div className={classes.containerScroll}>
						<RecipeMultiplierField
							recipe={recipe}
							className={classes.multiplier}
						/>
						<H5 className={sprinkles({ mx: 2 })}>Ingredients</H5>
						<IngredientCheckoffView recipe={recipe} className={classes.list} />
					</div>
				</animated.div>
				{showNowPlaying && (
					<CollapsibleContent>
						<div className={classes.nowPlaying}>
							{otherRecipes.map((recipe) => (
								<Suspense fallback={null} key={recipe.get('id')}>
									<RecipeNowPlayingLink recipe={recipe} />
								</Suspense>
							))}
						</div>
					</CollapsibleContent>
				)}
			</PageNowPlaying>
		</CollapsibleRoot>
	);
}

function useExpandingContainer(onOpen: () => void) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [containerStyle, containerSpring] = useSpring(() => ({
		height: 0,
		config: { tension: 300, friction: 30 },
	}));

	const lastExpandedHeightRef = useRef(PEEK_HEIGHT);

	const onToggle = () => {
		if (containerStyle.height.goal) {
			containerSpring.start({ height: 0 });
		} else {
			containerSpring.start({
				height: Math.max(PEEK_HEIGHT, lastExpandedHeightRef.current),
			});
			onOpen();
		}
	};

	const bind = useDrag(({ delta: [, dy], tap }) => {
		let target = Math.min(MAX_HEIGHT, containerStyle.height.goal - dy);
		if (target < 24) {
			target = 0;
		} else {
			onOpen();
		}
		if (target >= PEEK_HEIGHT) {
			lastExpandedHeightRef.current = target;
		}
		containerSpring.start({
			height: target,
			immediate: true,
		});
		if (tap) {
			onToggle();
		}
	});

	const close = useCallback(() => {
		containerSpring.start({ height: 0 });
	}, []);

	return { containerRef, bind, containerStyle, close };
}
