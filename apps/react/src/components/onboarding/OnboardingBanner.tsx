import { Onboarding, OnboardingStep } from '@/onboarding/createOnboarding.js';
import classNames from 'classnames';
import * as classes from './OnboardingBanner.css.js';
import { ReactNode } from 'react';
import {
	Button,
	CollapsibleContent,
	CollapsibleRoot,
	leekTheme,
} from '@aglio/ui';

export interface OnboardingBannerProps<O extends Onboarding<any>> {
	onboarding: O;
	step: O extends Onboarding<infer S> ? S[number] : never;
	children: ReactNode;
	className?: string;
	disableNext?: boolean;
}

export function OnboardingBanner<O extends Onboarding<any>>({
	onboarding,
	step,
	children,
	className,
	disableNext,
}: OnboardingBannerProps<O>) {
	const skip = onboarding.useSkip();
	const [show, next, isLast] = onboarding.useStep(step);

	// if (!show) return null;

	return (
		<CollapsibleRoot
			open={show}
			className={classNames(leekTheme, classes.root, className)}
		>
			<CollapsibleContent>
				<div className={classes.content}>
					<div>{children}</div>
					<div className={classes.buttons}>
						{!disableNext && (
							<Button color="primary" onClick={next}>
								{isLast ? 'Finish' : 'Next'}
							</Button>
						)}
					</div>
				</div>
			</CollapsibleContent>
		</CollapsibleRoot>
	);
}
