import classNames from 'classnames';
import { CSSProperties } from 'react';

export interface DemoFrameProps {
	demo: string;
	style?: CSSProperties;
	className?: string;
}

export function DemoFrame({ demo, className, ...rest }: DemoFrameProps) {
	return (
		<div
			className={classNames(
				'flex flex-col border-default rounded-lg overflow-hidden',
				className,
			)}
			{...rest}
		>
			<video
				autoPlay
				loop
				muted
				controls={false}
				src={`/videos/demos/${demo}.mp4`}
				className="w-full h-auto object-cover"
			/>
		</div>
	);
}
