// client ID, and therefore library ID, is inferred

import { SyncOperation } from './operation.js';
import { ReplicaInfo } from './replica.js';

export type HeartbeatMessage = {
	type: 'heartbeat';
	timestamp: string;
};

// from connection metadata.
export type OperationMessage = {
	type: 'op';
	// FIXME: redundant with replicaId on SyncOperation? can this be combined?
	replicaInfo: ReplicaInfo;
} & SyncOperation;

export type OperationRebroadcastMessage = {
	type: 'op-re';
	replicaInfo: ReplicaInfo;
	op: OperationMessage;
};

export type SyncMessage = {
	type: 'sync';
	// the time this message was sent
	timestamp: string;
	// the schema version known by this client
	schemaVersion: number;
	// the replica info for this client
	replicaInfo: ReplicaInfo;
	// local operations this client has applied since last online
	ops: SyncOperation[];
};

export type SyncResponseMessage = {
	type: 'sync-resp';
	ops: SyncOperation[];
	// update the client on the state of its peers
	peers: ReplicaInfo[];
};

export type UpdateRequiredMessage = {
	type: 'update-req';
	requiredSchemaVersion: number;
};

export type Message =
	| HeartbeatMessage
	| OperationMessage
	| SyncMessage
	| SyncResponseMessage
	| OperationRebroadcastMessage
	| UpdateRequiredMessage;

export type ClientMessage = HeartbeatMessage | SyncMessage | OperationMessage;
export type ServerMessage =
	| SyncResponseMessage
	| OperationRebroadcastMessage
	| UpdateRequiredMessage;
