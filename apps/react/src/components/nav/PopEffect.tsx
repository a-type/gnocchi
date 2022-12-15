import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import * as classes from './PopEffect.css.js';

export interface PopEffectProps {
	active?: boolean;
	className?: string;
}

export function PopEffect({ active, className }: PopEffectProps) {
	const [animate, setAnimate] = useState(active);
	useEffect(() => {
		if (active) {
			setAnimate(true);
			const timeout = setTimeout(() => {
				setAnimate(false);
			}, 1500);
			return () => clearTimeout(timeout);
		}
	}, [active]);

	return (
		<div className={clsx(classes.root, className)} data-active={animate}>
			<div className={clsx(classes.inner)} data-active={animate} />
		</div>
	);
}
