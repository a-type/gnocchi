import { DocumentBaseline, ReplicaInfo } from '@aglio/storage-common';

export interface OperationHistoryItemSpec {
	id: string;
	libraryId: string;
	collection: string;
	documentId: string;
	patch: any;
	timestamp: string;
}

export interface DocumentBaselineSpec extends DocumentBaseline<any> {}

export interface DocumentSpec {
	id: string;
	libraryId: string;
	collection: string;
	snapshot: any;
	timestamp: string;
}

export interface ClientConnectionDataSpec extends ReplicaInfo {
	libraryId: string;
	lastSeenWallClockTime: number;
}
