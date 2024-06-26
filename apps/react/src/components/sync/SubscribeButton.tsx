import { Button } from '@a-type/ui/components/button';
import { API_HOST_HTTP, PRICE_MONTHLY_DOLLARS } from '@/config.js';

export interface SubscribeButtonProps {
	className?: string;
}

export function SubscribeButton(props: SubscribeButtonProps) {
	return (
		<form
			action={`${API_HOST_HTTP}/api/stripe/create-checkout`}
			method="POST"
			{...props}
		>
			<input type="hidden" name="priceKey" value="default" />
			<Button color="primary" type="submit">
				Subscribe for ${PRICE_MONTHLY_DOLLARS}/month
			</Button>
			<span className="text-xs">
				Cancel anytime. Your list will still be on this device forever.
			</span>
		</form>
	);
}
