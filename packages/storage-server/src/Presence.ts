import { UserInfo } from '@aglio/storage-common';

/**
 * Stores client presence in-memory for connected
 * clients
 */
export class Presence {
	private presences: Record<string, UserInfo<any, any>> = {};

	constructor() {}

	set = (clientId: string, presence: UserInfo<any, any>) => {
		this.presences[clientId] = presence;
	};

	delete = (clientId: string) => {
		delete this.presences[clientId];
	};

	all = () => {
		return this.presences;
	};
}
