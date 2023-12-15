import { Button, ButtonProps } from '@a-type/ui/components/button';
import { signupDialogState } from '../sync/state.js';

export interface PromoteSubscriptionButtonProps extends ButtonProps {}

export function PromoteSubscriptionButton({
	children,
	...rest
}: PromoteSubscriptionButtonProps) {
	return (
		<Button
			color="primary"
			{...rest}
			onClick={() => (signupDialogState.status = 'open')}
		>
			{children}
		</Button>
	);
}
