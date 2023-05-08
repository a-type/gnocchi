import { useIsRouteTransitioning } from '@verdant-web/react-router';
import { animated, useSpring } from '@react-spring/web';
import classNames from 'classnames';
import * as classes from './TopLoader.css.js';
import { useCallback, useEffect } from 'react';

export interface TopLoaderProps {
	className?: string;
}

export function TopLoader({ className }: TopLoaderProps) {
	const show = useIsRouteTransitioning(500);

	const [style, spring] = useSpring(() => ({
		width: '0%',
	}));

	const run = useCallback(() => {
		let timeout: NodeJS.Timeout | undefined;
		function step(previous: number) {
			console.log(previous);
			spring.start({
				width: `${previous}%`,
			});
			const nextStep = Math.min(
				95 - previous,
				Math.min((95 - previous) / 2, Math.random() * 20),
			);
			timeout = setTimeout(
				step,
				500 + Math.random() * 1000,
				previous + nextStep,
			);
		}
		step(0);
		return () => {
			if (timeout) clearTimeout(timeout);
			spring.start({
				width: '100%',
			});
		};
	}, [show, spring]);

	useEffect(() => {
		if (show) {
			return run();
		}
	}, [show, run]);

	return (
		<div
			className={classNames(classes.root, className)}
			data-state={show ? 'visible' : 'hidden'}
		>
			<animated.div className={classes.bar} style={style} />
		</div>
	);
}
