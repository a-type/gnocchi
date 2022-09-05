import { assert } from '@aglio/tools';
import Stripe from 'stripe';

assert(process.env.STRIPE_SECRET_KEY, 'STRIPE_SECRET_KEY is required');

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2022-08-01',
});
