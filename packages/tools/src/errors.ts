export enum SubscriptionError {
	NoAccount = 'You need to log in',
	NoPlan = "You haven't started a plan yet",
	NoSubscription = 'You need to subscribe to use this feature',
	SubscriptionExpired = 'Your subscription has expired or payment was rejected',
	PlanChanged = 'You have been removed from a subscription plan. Subscribe to begin syncing again.',
}

export class RequestError extends Error {
	constructor(readonly status: number, message: string) {
		super(message);
	}
}
