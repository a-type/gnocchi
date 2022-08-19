import { SyncPatch } from './patch.js';

export interface SyncOperation {
	id: string;
	collection: string;
	documentId: string;
	patch: SyncPatch; // TODO: encode?
	timestamp: string;
}
