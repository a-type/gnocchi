// client ID, and therefore library ID, is inferred

import { SyncOperation } from './operation.js';

// from connection metadata.
export type OperationMessage = {
	type: 'op';
} & SyncOperation;

export type OperationRebroadcastMessage = {
	type: 'op-re';
	clientId: string;
	op: OperationMessage;
};

export type SyncMessage = {
	type: 'sync';
	// the latest operation timestamp known
	// by this client
	from: string;
	// the time this message was sent
	timestamp: string;
};

export type SyncResponseMessage = {
	type: 'sync-resp';
	ops: OperationMessage[];
	// update the client on the state of its peers
	peers: {
		id: string;
		oldestOperationLogicalTime: string;
		lastSeenLogicalTime: string;
	}[];
};

export type Message =
	| OperationMessage
	| SyncMessage
	| SyncResponseMessage
	| OperationRebroadcastMessage;

export type ClientMessage = SyncMessage | OperationMessage;
export type ServerMessage = SyncResponseMessage | OperationRebroadcastMessage;
