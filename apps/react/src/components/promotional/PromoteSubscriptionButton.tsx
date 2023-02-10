import { Button, ButtonProps } from '@aglio/ui';
import { signupDialogState } from '../sync/StartSignupDialog.jsx';

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
