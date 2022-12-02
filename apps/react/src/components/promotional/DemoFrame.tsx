import { clsx } from 'clsx';
import { CSSProperties } from 'react';
import * as classes from './DemoFrame.css.js';

export interface DemoFrameProps {
	demo: 'basics' | 'multiplayer' | 'lists';
	style?: CSSProperties;
	className?: string;
}

export function DemoFrame({ demo, className, ...rest }: DemoFrameProps) {
	return (
		<div className={clsx(classes.root, className)} {...rest}>
			<img src={`/images/demos/${demo}.gif`} className={classes.image} />
		</div>
	);
}
