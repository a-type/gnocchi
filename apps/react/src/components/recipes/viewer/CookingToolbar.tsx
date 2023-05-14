import { Icon } from '@/components/icons/Icon.jsx';
import { Recipe } from '@aglio/groceries-client';
import { Button } from '@aglio/ui/components/button';
import { PageNowPlaying } from '@aglio/ui/components/layouts';
import { H5 } from '@aglio/ui/components/typography';
import { ListBulletIcon } from '@radix-ui/react-icons';
import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { useCallback, useRef } from 'react';
import { IngredientCheckoffView } from './IngredientCheckoffView.jsx';
import { RecipeMultiplierField } from './RecipeMultiplierField.jsx';

export interface CookingToolbarProps {
	recipe: Recipe;
}

const PEEK_HEIGHT = 150;
const MAX_HEIGHT = 400;

export function CookingToolbar({ recipe }: CookingToolbarProps) {
	const { containerRef, containerStyle, bind } = useExpandingContainer();

	return (
		<PageNowPlaying
			unstyled
			className="w-full flex flex-col items-center relative bottom-[calc(0.25rem*-1)]"
		>
			<div className="flex flex-row gap-2 mb-3">
				<Button
					className="important:(rounded-full w-40px h-40px p-0 flex items-center justify-center touch-none)"
					{...bind()}
				>
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
					<RecipeMultiplierField recipe={recipe} className="mb-2" />
					<H5 className="mx-2">Ingredients</H5>
					<IngredientCheckoffView recipe={recipe} className="important:p-2" />
				</div>
			</animated.div>
		</PageNowPlaying>
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
