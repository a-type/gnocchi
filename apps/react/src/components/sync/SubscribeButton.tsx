import { Button, Span } from '@aglio/ui';
import { API_HOST_HTTP, PRICE_MONTHLY_DOLLARS } from '@/config.js';
import React from 'react';

export interface SubscribeButtonProps {}

export function SubscribeButton({}: SubscribeButtonProps) {
	return (
		<form action={`${API_HOST_HTTP}/api/stripe/create-checkout`} method="POST">
			<input type="hidden" name="priceKey" value="default" />
			<Button color="primary" type="submit">
				Subscribe for ${PRICE_MONTHLY_DOLLARS}/month
			</Button>
			<Span size="xs">
				Cancel anytime. Your list will still be on this device forever.
			</Span>
		</form>
	);
}
