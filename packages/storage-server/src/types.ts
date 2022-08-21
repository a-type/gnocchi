import {
	DocumentBaseline,
	ReplicaInfo,
	SyncOperation,
} from '@aglio/storage-common';

export type OperationHistoryItemSpec = SyncOperation & {
	libraryId: string;
};

export interface DocumentBaselineSpec extends DocumentBaseline<any> {}

export interface DocumentSpec {
	id: string;
	libraryId: string;
	collection: string;
	snapshot: any;
	timestamp: string;
}

export interface ReplicaInfoSpec extends ReplicaInfo {
	libraryId: string;
	// the authenticated client ID authorized
	// to write to this replica
	clientId: string;
	lastSeenWallClockTime: number;
}
