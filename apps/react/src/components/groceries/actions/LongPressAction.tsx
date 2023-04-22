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
import { sprinkles } from '@aglio/ui/styles';
import classNames from 'classnames';
import { useCallback, useRef, useState } from 'react';
import * as classes from './LongPressAction.css.js';

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

	const onDown = useCallback(() => {
		timeoutRef.current = setTimeout(() => {
			setState('idle');
			onActivate();
			timeoutRef.current = null;
		}, duration);
		setState('holding');
		navigator?.vibrate?.(duration);
	}, [onActivate, duration]);
	const onUp = useCallback(() => {
		console.log('onup');
		navigator?.vibrate?.(0);
		if (timeoutRef.current && state === 'holding') {
			clearTimeout(timeoutRef.current);
			setState('failed');
			setTimeout(() => {
				setState('idle');
			}, 1000);
		} else {
			setState('idle');
		}
	}, [state]);

	return (
		<Popover modal={false} open={state !== 'idle'}>
			<PopoverAnchor asChild>
				<ActionButton
					size="small"
					onPointerDown={onDown}
					onPointerUp={onUp}
					onPointerCancel={onUp}
					onPointerLeave={onUp}
					onContextMenu={preventDefault}
					{...rest}
				>
					{children}
				</ActionButton>
			</PopoverAnchor>
			<PopoverContent
				side="top"
				sideOffset={12}
				className={classes.popoverContent}
			>
				<PopoverArrow />
				<div
					className={classNames(
						classes.progress,
						sprinkles({
							background: progressColor,
						}),
						state === 'holding' && classes.progressing,
					)}
					style={{
						animationDuration: `${duration}ms`,
					}}
					key={timeoutRef.current as any}
				/>
				<div className={classes.warning}>Hold for 2 seconds</div>
			</PopoverContent>
		</Popover>
	);
}
