import { Onboarding } from '@/onboarding/createOnboarding.js';
import {
	Button,
	Popover,
	PopoverAnchor,
	PopoverArrow,
	PopoverContent,
	leekTheme,
} from '@aglio/ui';
import { ReactNode } from 'react';
import classNames from 'classnames';
import * as classes from './OnboardingTooltip.css.js';

export interface OnboardingTooltipProps<O extends Onboarding<any>> {
	onboarding: O;
	step: O extends Onboarding<infer S> ? S[number] : never;
	children: ReactNode;
	className?: string;
	disableNext?: boolean;
	content: ReactNode;
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
}: OnboardingTooltipProps<O>) {
	const skip = onboarding.useSkip();
	const [show, next, isLast] = onboarding.useStep(step);

	return (
		<Popover
			open={show}
			modal={false}
			onOpenChange={(open) => {
				if (show && !open) {
					next();
				}
			}}
		>
			<PopoverAnchor asChild>{children}</PopoverAnchor>
			<PopoverContent
				disableBlur
				className={classNames(leekTheme, classes.content)}
			>
				<PopoverArrow className={classes.arrow} />
				<div>{content}</div>
				{!disableNext && (
					<div className={classes.buttons}>
						<Button color="primary" onClick={next}>
							{isLast ? 'Finish' : 'Next'}
						</Button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
};
