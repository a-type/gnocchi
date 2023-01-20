import { PageNowPlaying } from '@/components/layouts/index.jsx';
import { Button, H5 } from '@/components/primitives/index.js';
import { sprinkles } from '@/styles/sprinkles.css.js';
import { Recipe } from '@aglio/groceries-client';
import { ListBulletIcon } from '@radix-ui/react-icons';
import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import classnames from 'classnames';
import { useRef } from 'react';
import * as classes from './CookingToolbar.css.js';
import { IngredientCheckoffView } from './IngredientCheckoffView.jsx';

export interface CookingToolbarProps {
	recipe: Recipe;
}

const PEEK_HEIGHT = 110;
const MAX_HEIGHT = 300;

export function CookingToolbar({ recipe }: CookingToolbarProps) {
	const lastExpandedHeightRef = useRef(PEEK_HEIGHT);

	const containerRef = useRef<HTMLDivElement>(null);
	const [containerStyle, containerSpring] = useSpring(() => ({
		height: 0,
	}));

	const onToggle = () => {
		if (containerStyle.height.goal) {
			containerSpring.start({ height: 0 });
		} else {
			containerSpring.start({
				height: Math.max(PEEK_HEIGHT, lastExpandedHeightRef.current),
			});
		}
	};

	const bind = useDrag(({ down, delta: [, dy], tap }) => {
		const target = Math.min(MAX_HEIGHT, containerStyle.height.goal - dy);
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

	return (
		<PageNowPlaying unstyled className={classes.root}>
			<Button className={classes.toggleButton} {...bind()}>
				<ListBulletIcon />
			</Button>
			<animated.div
				ref={containerRef}
				className={classnames(classes.container)}
				style={{
					height: containerStyle.height,
					borderTop: containerStyle.height.to((h) =>
						h > 0 ? '1px solid currentColor' : 'none',
					),
				}}
			>
				<div className={classes.containerScroll}>
					<H5 className={sprinkles({ mx: 2 })}>Ingredients</H5>
					<IngredientCheckoffView recipe={recipe} className={classes.list} />
				</div>
			</animated.div>
		</PageNowPlaying>
	);
}
