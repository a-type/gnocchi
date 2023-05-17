import { Button, ButtonProps } from '@aglio/ui/components/button';
import { API_HOST_HTTP } from '@/config.js';

export interface ManageSubscriptionButtonProps extends ButtonProps {}

export function ManageSubscriptionButton({
	className,
	...props
}: ManageSubscriptionButtonProps) {
	return (
		<form
			className={className}
			action={`${API_HOST_HTTP}/api/stripe/create-portal`}
			method="POST"
		>
			<Button type="submit" {...props}>
				Change your subscription
			</Button>
			<span className="text-xs">Update your card or unsubscribe</span>
		</form>
	);
}
