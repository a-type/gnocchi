import { Onboarding } from '@/onboarding/createOnboarding.js';
import { ReactNode, useEffect, useState } from 'react';
import classNames from 'classnames';
import * as classes from './OnboardingTooltip.css.js';
import { Cross2Icon } from '@radix-ui/react-icons';
import {
	Popover,
	PopoverAnchor,
	PopoverArrow,
	PopoverContent,
} from '@aglio/ui/components/popover';
import { leekTheme } from '@aglio/ui/styles';
import { Button } from '@aglio/ui/components/button';

export interface OnboardingTooltipProps<O extends Onboarding<any>> {
	onboarding: O;
	step: O extends Onboarding<infer S> ? S[number] : never;
	children: ReactNode;
	className?: string;
	disableNext?: boolean;
	content: ReactNode;
	/** Pass a filter to ignore interactions for auto-next */
	ignoreOutsideInteraction?: (target: HTMLElement) => boolean;
}

export const OnboardingTooltip = function OnboardingTooltip<
	O extends Onboarding<any>,
>({
	onboarding,
	step,
	children,
	className,
	disableNext,
	content,
	ignoreOutsideInteraction,
}: OnboardingTooltipProps<O>) {
	const [show, next, isLast] = onboarding.useStep(step);

	// delay
	const [delayedOpen, setDelayedOpen] = useState(false);
	useEffect(() => {
		if (show) {
			const timeout = setTimeout(() => {
				setDelayedOpen(true);
			}, 500);
			return () => clearTimeout(timeout);
		}
	}, [show]);

	return (
		<Popover open={delayedOpen && show} modal={false}>
			<PopoverAnchor asChild>{children}</PopoverAnchor>
			<PopoverContent
				disableBlur
				className={classNames(leekTheme, classes.content)}
				onInteractOutside={(event) => {
					// if the user interacts outside the popover,
					// and it's with anything besides a button or input,
					// go to the next step
					const target = event.target as HTMLElement;
					if (!ignoreOutsideInteraction || !ignoreOutsideInteraction(target)) {
						next();
					}
				}}
			>
				<PopoverArrow className={classes.arrow} />
				<div className={classes.innerContent}>
					{content}
					{!disableNext && (
						<Button color={isLast ? 'primary' : 'ghost'} onClick={next}>
							{isLast ? 'Finish' : <Cross2Icon />}
						</Button>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
};
