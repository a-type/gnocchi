import { DocumentBaseline, ReplicaInfo, SyncOperation } from '@aglio/storage-common';
export declare type OperationHistoryItemSpec = Omit<SyncOperation, 'patch'> & {
    libraryId: string;
    patch: string;
};
export interface DocumentBaselineSpec extends Omit<DocumentBaseline<any>, 'snapshot'> {
    snapshot: string;
    libraryId: string;
}
export interface DocumentSpec {
    id: string;
    libraryId: string;
    collection: string;
    snapshot: any;
    timestamp: string;
}
export interface ReplicaInfoSpec extends ReplicaInfo {
    libraryId: string;
    clientId: string;
    lastSeenWallClockTime: number;
}
//# sourceMappingURL=types.d.ts.map