import { Request, Response } from 'express';
import { getLoginSession } from '@aglio/auth';
import { UI_ORIGIN } from '../../config/deployedContext.js';
import { stripe } from '../../data/stripe.js';

export async function createCheckoutHandler(req: Request, res: Response) {
	const session = await getLoginSession(req);

	if (!session) {
		return res.status(401).send('Please log in');
	}

	const { priceKey } = req.body;

	const prices = await stripe.prices.list({
		lookup_keys: [priceKey],
		expand: ['data.product'],
	});

	const price = prices.data[0];

	if (!price) {
		return res.status(400).send('Invalid price');
	}

	const checkout = await stripe.checkout.sessions.create({
		billing_address_collection: 'auto',
		allow_promotion_codes: true,
		line_items: [
			{
				price: price.id,
				quantity: 1,
			},
		],
		mode: 'subscription',
		success_url: `${UI_ORIGIN}?success=true&session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${UI_ORIGIN}/nevermind`,
		subscription_data: {
			metadata: {
				planId: session.planId,
			},
			trial_period_days: 14,
		},
	});

	if (!checkout.url) {
		return res.status(500).send('Error creating checkout session');
	}

	return res.redirect(checkout.url);
}
