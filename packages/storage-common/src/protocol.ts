// client ID, and therefore library ID, is inferred

import { DocumentBaseline } from './baseline.js';
import { SyncOperation } from './operation.js';
import { ReplicaInfo } from './replica.js';

export type HeartbeatMessage = {
	type: 'heartbeat';
	timestamp: string;
};

/**
 * Used by clients to indicate they have
 * successfully applied all operations from the
 * server up to this logical timestamp.
 */
export type AckMessage = {
	type: 'ack';
	replicaId: string;
	timestamp: string;
};

// from connection metadata.
export type OperationMessage = {
	type: 'op';
	op: SyncOperation;
};

export type OperationRebroadcastMessage = {
	type: 'op-re';
	ops: SyncOperation[];
	globalAckTimestamp: string;
};

export type SyncMessage = {
	type: 'sync';
	/** This client's replica ID */
	replicaId: string;
	/** the logical time this message was sent */
	timestamp: string;
	/** the schema version known by this client */
	schemaVersion: number;
};

export type SyncResponseMessage = {
	type: 'sync-resp';
	// operations this client should apply
	ops: SyncOperation[];
	// baselines this client should apply
	baselines: DocumentBaseline[];
	/**
	 * The server requests any changes since this time from the client.
	 * Null means all changes.
	 */
	provideChangesSince: string | null;
	/**
	 * Update client on the global ack
	 */
	globalAckTimestamp: string;
	/**
	 * TODO: update client on global prehistory
	 */
};

export type SyncStep2Message = {
	type: 'sync-step2';
	replicaId: string;
	/** Any new operations created since the requested time */
	ops: SyncOperation[];
	/** Any new baselines created since the requested time */
	baselines: DocumentBaseline[];
	/** The time this message was sent. Can be used for ack. */
	timestamp: string;
};

/**
 * If the server detects schema drift from a client, it will
 * terminate the sync process and require the client to update
 * before syncing.
 */
export type UpdateRequiredMessage = {
	type: 'update-req';
	requiredSchemaVersion: number;
};

export type Message =
	| HeartbeatMessage
	| OperationMessage
	| SyncMessage
	| SyncResponseMessage
	| SyncStep2Message
	| OperationRebroadcastMessage
	| UpdateRequiredMessage
	| AckMessage;

export type ClientMessage =
	| HeartbeatMessage
	| SyncMessage
	| SyncStep2Message
	| OperationMessage
	| AckMessage;
export type ServerMessage =
	| HeartbeatMessage
	| SyncResponseMessage
	| OperationRebroadcastMessage
	| UpdateRequiredMessage;
