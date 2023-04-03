import { Button, ButtonProps } from '@aglio/ui/components/button';
import { API_HOST_HTTP } from '@/config.js';
import { Span } from '@aglio/ui/components/typography';

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
			<Span size="xs">Update your card or unsubscribe</Span>
		</form>
	);
}
