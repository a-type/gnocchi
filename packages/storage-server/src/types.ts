import {
	DocumentBaseline,
	Operation,
	ReplicaInfo,
} from '@aglio/storage-common';

export type PatchHistoryItemSpec = Omit<Operation, 'data'> & {
	libraryId: string;
	data: string;
	replicaId: string;
};

export interface DocumentBaselineSpec
	extends Omit<DocumentBaseline<any>, 'snapshot'> {
	snapshot: string;
	libraryId: string;
}

export interface ReplicaInfoSpec extends ReplicaInfo {
	libraryId: string;
	// the authenticated client ID authorized
	// to write to this replica
	clientId: string;
	lastSeenWallClockTime: number | null;
}
