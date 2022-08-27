import { DocumentBaseline, SyncOperation } from '@aglio/storage-common';
import { Database } from 'better-sqlite3';
export declare class Baselines {
    private db;
    private libraryId;
    constructor(db: Database, libraryId: string);
    get: (documentId: string) => DocumentBaseline<any> | null;
    set: (baseline: DocumentBaseline) => import("better-sqlite3").RunResult;
    insertAll: (baselines: DocumentBaseline[]) => void;
    private hydrateSnapshot;
    getAllAfter: (timestamp: string) => DocumentBaseline<any>[];
    applyOperations: (documentId: string, operations: SyncOperation[]) => void;
}
//# sourceMappingURL=Baselines.d.ts.map