import { Icon } from '@/components/icons/Icon.jsx';
import { Recipe } from '@aglio/groceries-client';
import { Button } from '@a-type/ui/components/button';
import { ArrowUpIcon, ListBulletIcon } from '@radix-ui/react-icons';
import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import classNames from 'classnames';
import { useCallback, useRef } from 'react';
import { IngredientCheckoffView } from './IngredientCheckoffView.jsx';

export interface CookingToolbarProps {
	recipe: Recipe;
	className?: string;
}

const PEEK_HEIGHT = 300;
const MAX_HEIGHT = 500;

const AnimatedButton = animated(Button);

export function CookingToolbar({ recipe, className }: CookingToolbarProps) {
	const { containerRef, containerStyle, bind } = useExpandingContainer();

	return (
		<div
			className={classNames(
				'w-full flex flex-col items-center relative bottom-[calc(0.25rem*-1)] mb-2 max-w-600px',
				className,
			)}
		>
			<div className="w-full grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr] grid-areas-[empty_ingredients_top] gap-2 items-center relative z-1">
				<AnimatedButton
					size="small"
					className="[grid-area:ingredients] rounded-full flex items-center justify-center touch-none gap-2 shadow-lg py-2"
					{...bind()}
					style={{
						y: containerStyle.height.to((h) => (h > 0 ? '50%' : '0%')),
					}}
				>
					<animated.span
						className="inline-flex h-15px items-center justify-center"
						style={{
							display: containerStyle.height.to((h) =>
								h > 0 ? 'none' : 'block',
							),
						}}
					>
						<ListBulletIcon />
					</animated.span>
					<animated.span
						className="inline-flex h-15px items-center justify-center"
						style={{
							display: containerStyle.height.to((h) =>
								h > 0 ? 'block' : 'none',
							),
						}}
					>
						<Icon name="drag_vertical" />
					</animated.span>
					<animated.span>
						{containerStyle.height.to((h) =>
							h > 0 ? 'Resize / Close' : 'Ingredients',
						)}
					</animated.span>
				</AnimatedButton>
				<Button
					size="icon"
					color="default"
					className="shadow-lg [grid-area:top] justify-self-end mr-2"
					onClick={() => {
						// careful, this relies on page structure in RecipeOverview...
						const top = document.getElementById('pageTop');
						top?.scrollIntoView({ behavior: 'smooth' });
					}}
				>
					<ArrowUpIcon />
				</Button>
			</div>

			<animated.div
				ref={containerRef}
				className="bg-white w-full relative overflow-hidden rounded-lg"
				style={{
					height: containerStyle.height,
					border: containerStyle.height.to((h) =>
						h > 0 ? '1px solid currentColor' : 'none',
					),
				}}
			>
				<div className="overflow-overlay h-full mt-3 pb-[calc(40px+env(safe-area-inset-bottom,0px))] flex flex-col items-center px-1">
					<IngredientCheckoffView recipe={recipe} className="important:p-2" />
				</div>
			</animated.div>
		</div>
	);
}

function useExpandingContainer(onOpen?: () => void) {
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
			onOpen?.();
		}
	};

	const bind = useDrag(({ delta: [, dy], tap }) => {
		let target = Math.min(MAX_HEIGHT, containerStyle.height.goal - dy);
		if (target < 24) {
			target = 0;
		} else {
			onOpen?.();
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
