import { useAnimationFrame } from '@/hooks/useAnimationFrame.js';
import { preventDefault } from '@/lib/eventHandlers.js';
import { ActionButton, ActionButtonProps } from '@a-type/ui/components/actions';
import {
	Popover,
	PopoverAnchor,
	PopoverArrow,
	PopoverContent,
} from '@a-type/ui/components/popover';
import { useDrag } from '@use-gesture/react';
import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';

export type LongPressActionProps = ActionButtonProps & {
	onActivate: () => void;
	duration?: number;
	progressColor?: 'attentionLight' | 'accentLight' | 'primaryLight';
	delay?: number;
};

/**
 * The press gesture must remain within THRESHOLD_DISTANCE until delay time has passed
 * to be considered a press.
 *
 * After delay, the gesture must remain within CANCEL_DISTANCE or be cancelled.
 */
const THRESHOLD_DISTANCE = 10;
const CANCEL_DISTANCE = 30;

export function LongPressAction({
	onActivate,
	progressColor = 'attentionLight',
	children,
	duration = 2000,
	delay = 200,
	...rest
}: LongPressActionProps) {
	const [gestureState, setGestureState] = useState<'released' | 'pressed'>(
		'released',
	);
	const [state, setState] = useState<'holding' | 'idle' | 'failed' | 'pending'>(
		'idle',
	);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const ref = useRef<HTMLButtonElement>(null);

	const gestureStateRef = useRef<{ distance: number; startedAt: number }>({
		distance: 0,
		startedAt: 0,
	});
	useDrag(
		({ first, cancel, elapsedTime, down, distance }) => {
			const totalDistance = Math.sqrt(
				Math.pow(distance[0], 2) + Math.pow(distance[1], 2),
			);
			gestureStateRef.current.distance = totalDistance;

			if (elapsedTime < delay && totalDistance > THRESHOLD_DISTANCE) {
				cancel();
				setGestureState('released');
				return;
			}

			if (totalDistance > CANCEL_DISTANCE) {
				cancel();
				setGestureState('released');
				return;
			}

			if (first) {
				gestureStateRef.current.startedAt = Date.now();
				try {
					navigator?.vibrate?.(200);
				} catch (err) {
					console.log(err);
				}
			}

			if (down) {
				setGestureState('pressed');
			} else {
				setGestureState('released');
			}
		},
		{
			// triggerAllEvents: true,
			// preventDefault: true,
			target: ref,
		},
	);

	useAnimationFrame(() => {
		const gestureDuration = gestureStateRef.current.startedAt
			? Date.now() - gestureStateRef.current.startedAt
			: 0;
		const distance = gestureStateRef.current.distance;

		// nothing to do in this case
		if (
			gestureState === 'released' &&
			(state === 'idle' || state === 'failed')
		) {
			return;
		}

		if (gestureState === 'released') {
			if (state === 'holding') {
				// holding for longer than duration - activate
				if (gestureDuration >= duration + delay && distance < CANCEL_DISTANCE) {
					onActivate();
					setState('idle');
				} else {
					// normal release before duration - cancel
					setState('idle');
				}
			} else if (state === 'pending' && distance < THRESHOLD_DISTANCE) {
				setState('failed');
			}
		} else if (gestureState === 'pressed') {
			// begin a new press
			if (state === 'idle' || state === 'failed') {
				setState('pending');
			} else if (state === 'pending' && gestureDuration >= delay) {
				// begin holding after delay has passed
				setState('holding');
			} else if (distance > CANCEL_DISTANCE) {
				// cancel if moved too far
				setState('idle');
			}
		}
	});

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
		<Popover modal={false} open={state !== 'idle' && state !== 'pending'}>
			<PopoverAnchor asChild>
				<ActionButton
					size="small"
					onContextMenu={preventDefault}
					ref={ref}
					{...rest}
					className={classNames(rest.className)}
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
							`animate-keyframes-progress-bar animate-forwards animate-ease-linear`,
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
