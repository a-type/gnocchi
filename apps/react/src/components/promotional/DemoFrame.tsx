import classNames from 'classnames';
import { CSSProperties } from 'react';
import * as classes from './DemoFrame.css.js';

export interface DemoFrameProps {
	demo: string;
	style?: CSSProperties;
	className?: string;
}

export function DemoFrame({ demo, className, ...rest }: DemoFrameProps) {
	return (
		<div className={classNames(classes.root, className)} {...rest}>
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
