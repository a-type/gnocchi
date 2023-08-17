import { Suspense, useEffect, useRef, useState } from 'react';
import { useDrag } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';
import {
	RouteTree,
	Outlet,
	useNavigate,
	useNextMatchingRoute,
	RestoreScroll,
} from '@verdant-web/react-router';
import classNames from 'classnames';
import { AutoRestoreScroll } from '@/components/nav/AutoRestoreScroll.jsx';

export function SwipeOutlet({
	preload,
	scroll,
	className,
	restoreScroll,
	...rest
}: {
	preload?: boolean;
	scroll?: boolean;
	className?: string;
	restoreScroll?: boolean;
}) {
	const navigate = useNavigate();
	const match = useNextMatchingRoute();

	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const { left, right } = (match?.route.data ?? {}) as {
		left?: string;
		right?: string;
	};

	const leftPath = left && replacePathParams(left, match?.params);
	const rightPath = right && replacePathParams(right, match?.params);

	const [swipeDirection, setSwipeDirection] = useState<
		'left' | 'right' | undefined
	>(undefined);

	const [style, spring] = useSpring(() => ({
		x: 0,
	}));

	useEffect(() => {
		spring.start({
			x: 0,
		});
	}, [match?.route]);

	const goToLeft = () => {
		if (!leftPath) {
			spring.start({
				x: 0,
			});
			return;
		}

		navigate(leftPath, {
			skipTransition: true,
		});
		spring.set({
			x: style.x.get() - window.innerWidth,
		});
	};
	const goToRight = () => {
		if (!rightPath) {
			spring.start({
				x: 0,
			});
			return;
		}

		navigate(rightPath, {
			skipTransition: true,
			state: {
				isSwipeNavigation: true,
			},
		});
		spring.set({
			x: style.x.get() + window.innerWidth,
		});
	};

	const bind = useDrag(
		(state) => {
			let allowedMovement = state.movement[0];
			if (!left && allowedMovement > 0) {
				allowedMovement = 0;
			}
			if (!right && allowedMovement < 0) {
				allowedMovement = 0;
			}

			if (allowedMovement > 0) {
				setSwipeDirection('left');
			}
			if (allowedMovement < 0) {
				setSwipeDirection('right');
			}

			spring.start({
				x: allowedMovement,
				immediate: true,
			});

			if (state.last) {
				if (Math.abs(allowedMovement) > window.innerWidth / 3) {
					if (swipeDirection === 'left') {
						goToLeft();
					}
					if (swipeDirection === 'right') {
						goToRight();
					}
				} else if (state.swipe[0]) {
					if (state.swipe[0] > 0) {
						goToLeft();
					} else {
						goToRight();
					}
				} else {
					spring.start({
						x: 0,
					});
				}

				setSwipeDirection(undefined);
			}
		},
		{
			axis: 'x',
			threshold: 10,
		},
	);

	const renderLeft = leftPath && (preload || swipeDirection === 'left');
	const renderRight = rightPath && (preload || swipeDirection === 'right');

	return (
		<animated.div
			{...bind()}
			className={classNames(
				'relative overflow-hidden flex-1 w-full h-full touch-pan-y',
				'[--now-playing-bottom:0px]',
				className,
			)}
			{...rest}
		>
			{renderLeft && (
				<animated.div
					key={leftPath}
					style={{
						transform: style.x.to((v) => `translateX(${v}px)`),
					}}
					className={classNames(
						'absolute inset-0 left--100% w-full h-full overflow-hidden',
						{
							'will-change-transform': swipeDirection !== undefined,
						},
					)}
				>
					<Suspense>
						<RouteTree skip={1} path={leftPath} />
					</Suspense>
				</animated.div>
			)}
			<animated.div
				key={match?.path}
				style={{
					opacity: style.x.to((v) =>
						preload || style.x.goal === 0
							? 1
							: 1 - Math.abs(v / ((window.innerWidth * 2) / 3)),
					),
					transform: style.x.to((v) => `translateX(${v}px)`),
					// z: style.z,
				}}
				className={classNames('w-full h-full', {
					'will-change-transform': swipeDirection !== undefined,
				})}
			>
				<div
					className={classNames(
						'flex flex-col items-center w-full h-full',
						scroll && 'overflow-y-auto touch-pan-y',
					)}
					ref={scrollContainerRef}
				>
					<Outlet />
					{restoreScroll && <AutoRestoreScroll id="swipeOutlet" />}
				</div>
			</animated.div>
			{renderRight && (
				<animated.div
					key={rightPath}
					style={{
						transform: style.x.to((v) => `translateX(${v}px)`),
					}}
					className={classNames(
						'absolute inset-0 left-100% w-full h-full overflow-hidden',
						{
							'will-change-transform': swipeDirection !== undefined,
						},
					)}
				>
					<Suspense>
						<RouteTree skip={1} path={rightPath} />
					</Suspense>
				</animated.div>
			)}
		</animated.div>
	);
}

function replacePathParams(path: string, params?: Record<string, any>) {
	return path.replace(/:\w+/g, (match) => {
		const paramName = match.slice(1);
		return params?.[paramName] ?? '';
	});
}
