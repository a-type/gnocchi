import { SyncOperation } from '@aglio/storage-common';
import { Database } from 'better-sqlite3';
export declare class OperationHistory {
    private db;
    private libraryId;
    constructor(db: Database, libraryId: string);
    private hydrateOperation;
    getAllFor: (documentId: string) => SyncOperation[];
    getEarliest: (count: number) => SyncOperation[];
    getAfter: (timestamp?: string | null) => SyncOperation[];
    /**
     * Returns all operations before the given timestamp
     * in ascending chronological order
     */
    getBefore: (before: string) => SyncOperation[];
    insert: (item: SyncOperation) => import("better-sqlite3").RunResult;
    insertAll: (items: SyncOperation[]) => Promise<void>;
    dropAll: (items: SyncOperation[]) => Promise<void>;
}
//# sourceMappingURL=OperationHistory.d.ts.map