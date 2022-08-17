export interface OperationHistoryItemSpec {
	libraryId: string;
	collection: string;
	documentId: string;
	patch: any;
	timestamp: string;
}

export interface DocumentBaselineSpec {
	documentId: string;
	snapshot: any;
	timestamp: string;
}

export interface DocumentSpec {
	id: string;
	libraryId: string;
	collection: string;
	snapshot: any;
	timestamp: string;
}

export interface ClientConnectionDataSpec {
	id: string;
	libraryId: string;
	lastSeenWallClockTime: number;
	lastSeenLogicalTime: string;
	oldestOperationLogicalTime: string;
}
