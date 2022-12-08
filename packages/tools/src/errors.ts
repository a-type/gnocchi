export enum SubscriptionError {
	NoAccount = 'You need to log in',
	NoPlan = "You haven't started a plan yet",
	NoSubscription = 'You need to subscribe to use this feature',
	SubscriptionExpired = 'Your subscription has expired or payment was rejected',
}

export class RequestError extends Error {
	constructor(readonly status: number, message: string) {
		super(message);
	}
}
