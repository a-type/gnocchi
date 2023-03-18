import { clsx } from 'clsx';
import { CSSProperties } from 'react';
import * as classes from './DemoFrame.css.js';

export interface DemoFrameProps {
	demo: string;
	style?: CSSProperties;
	className?: string;
}

export function DemoFrame({ demo, className, ...rest }: DemoFrameProps) {
	return (
		<div className={clsx(classes.root, className)} {...rest}>
			<video
				autoPlay
				loop
				muted
				controls={false}
				src={`/videos/demos/${demo}.mp4`}
				className={classes.image}
			/>
		</div>
	);
}
