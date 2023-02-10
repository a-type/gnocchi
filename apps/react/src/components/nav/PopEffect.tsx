import { clsx } from 'clsx';
import { debounce } from '@a-type/utils';
import { useEffect, useMemo, useState } from 'react';
import * as classes from './PopEffect.css.js';

export interface PopEffectProps {
	active?: boolean;
	className?: string;
}

export function PopEffect({ active, className }: PopEffectProps) {
	const [animate, setAnimate] = useState(active);
	const cancelAnimation = useMemo(
		() => debounce(() => setAnimate(false), 1500),
		[setAnimate],
	);
	useEffect(() => {
		if (active) {
			setAnimate(true);
			cancelAnimation();
		}
	}, [active]);

	return (
		<div className={clsx(classes.root, className)} data-active={animate}>
			<div className={clsx(classes.inner)} data-active={animate} />
		</div>
	);
}
