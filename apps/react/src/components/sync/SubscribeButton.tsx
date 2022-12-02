import { Button, Span } from '@/components/primitives/index.js';
import { API_HOST_HTTP } from '@/config.js';
import React from 'react';

export interface SubscribeButtonProps {}

export function SubscribeButton({}: SubscribeButtonProps) {
	return (
		<form action={`${API_HOST_HTTP}/api/stripe/create-checkout`} method="POST">
			<input type="hidden" name="priceKey" value="default" />
			<Button color="primary" type="submit">
				Subscribe for $3/month
			</Button>
			<Span size="xs">
				Cancel anytime. Your list will still be on this device forever.
			</Span>
		</form>
	);
}
