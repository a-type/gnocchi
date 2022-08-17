export interface SyncOperation {
	id: string;
	collection: string;
	documentId: string;
	patch: any; // TODO:
	timestamp: string;
}
