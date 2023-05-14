import { preventDefault } from '@/lib/eventHandlers.js';
import {
	ActionButton,
	ActionButtonProps,
} from '@aglio/ui/src/components/actions';
import {
	Popover,
	PopoverAnchor,
	PopoverArrow,
	PopoverContent,
} from '@aglio/ui/src/components/popover';
import { useDrag } from '@use-gesture/react';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

export type LongPressActionProps = ActionButtonProps & {
	onActivate: () => void;
	duration?: number;
	progressColor?: 'attentionLight' | 'accentLight' | 'primaryLight';
};

export function LongPressAction({
	onActivate,
	progressColor = 'attentionLight',
	children,
	duration = 2000,
	...rest
}: LongPressActionProps) {
	const [state, setState] = useState<'holding' | 'idle' | 'failed'>('idle');
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const bind = useDrag(
		({ first, cancel, elapsedTime, down, distance }) => {
			if (first) {
				setState('holding');
				try {
					navigator?.vibrate?.(200);
				} catch (err) {
					console.log(err);
				}
			} else {
				if (elapsedTime < 300) {
					setState('failed');
					try {
						navigator?.vibrate?.(200);
					} catch (err) {
						console.log(err);
					}
					cancel();
				} else if (!down && elapsedTime > duration) {
					onActivate();
					setState('idle');
				} else if (
					down &&
					Math.sqrt(Math.pow(distance[0], 2) + Math.pow(distance[1], 2)) > 20
				) {
					cancel();
					setState('failed');
				}
			}
		},
		{
			filterTaps: false,
			triggerAllEvents: true,
			preventScroll: true,
		},
	);

	useEffect(() => {
		if (state === 'failed') {
			const timeout = setTimeout(() => {
				setState('idle');
			}, 1000);
			return () => {
				clearTimeout(timeout);
			};
		}
	}, [state]);

	return (
		<Popover modal={false} open={state !== 'idle'}>
			<PopoverAnchor asChild>
				<ActionButton
					size="small"
					onContextMenu={preventDefault}
					{...bind()}
					{...rest}
					className={classNames('touch-none', rest.className)}
				>
					{children}
				</ActionButton>
			</PopoverAnchor>
			<PopoverContent
				side="top"
				sideOffset={12}
				className="position-relative overflow-hidden px-4 py-2 text-sm"
			>
				<PopoverArrow />
				<div
					className={classNames(
						'position-absolute top-0 left-0 h-full',
						{
							'bg-attentionLight': progressColor === 'attentionLight',
							'bg-accentLight': progressColor === 'accentLight',
							'bg-primaryLight': progressColor === 'primaryLight',
						},
						state === 'holding' &&
							`animate-progress-bar animate-forwards animate-ease-linear`,
					)}
					style={{
						animationDuration: `${duration}ms`,
					}}
					key={timeoutRef.current as any}
				/>
				<div className="position-relative z-1">Hold for 2 seconds</div>
			</PopoverContent>
		</Popover>
	);
}
