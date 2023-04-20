import classNames from 'classnames';
import { debounce } from '@a-type/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as classes from './PopEffect.css.js';
import { useParticles } from '@aglio/ui/components/particles';

export interface PopEffectProps {
	active?: boolean;
	className?: string;
}

export function PopEffect({ active, className }: PopEffectProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [animate, setAnimate] = useState(active);
	const cancelAnimation = useMemo(
		() => debounce(() => setAnimate(false), 1500),
		[setAnimate],
	);
	const particles = useParticles();

	useEffect(() => {
		if (active) {
			setAnimate(true);
			cancelAnimation();
			if (ref.current) {
				particles?.addParticles(
					particles.elementExplosion({
						element: ref.current,
						count: 20,
					}),
				);
			}
		}
	}, [active]);

	return (
		<div
			className={classNames(classes.root, className)}
			data-active={animate}
			ref={ref}
		>
			<div className={classNames(classes.inner)} data-active={animate} />
		</div>
	);
}
