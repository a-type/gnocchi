export type OperationMessage = {
	type: 'op';
	collection: string;
	id: string;
	key: string;
	value: any;
	timestamp: string;
};

export type DeleteMessage = {
	type: 'delete';
	collection: string;
	id: string;
	timestamp: string;
};

export type Message = OperationMessage | DeleteMessage;
