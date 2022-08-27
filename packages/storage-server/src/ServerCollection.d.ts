import { OperationMessage } from '@aglio/storage-common';
import { Database } from 'better-sqlite3';
export declare class ServerCollection {
    private db;
    readonly libraryId: string;
    readonly name: string;
    private operationHistory;
    private baselines;
    constructor(db: Database, libraryId: string, name: string);
    /**
     * Applies an operation, inserting it into the operation history
     * and recomputing the document snapshot.
     */
    receive: ({ op }: OperationMessage) => void;
    private applyOperations;
    private applyOperation;
}
export declare class ServerCollectionManager {
    private db;
    readonly libraryId: string;
    private cache;
    constructor(db: Database, libraryId: string);
    open: (name: string) => ServerCollection;
    close: (name: string) => void;
}
//# sourceMappingURL=ServerCollection.d.ts.map