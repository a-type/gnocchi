import { Database } from 'better-sqlite3';
import { ReplicaInfoSpec } from './types.js';
export declare class ReplicaInfos {
    private db;
    private libraryId;
    constructor(db: Database, libraryId: string);
    getOrCreate: (replicaId: string, clientId: string | null) => ReplicaInfoSpec;
    getAll: () => ReplicaInfoSpec[];
    updateOldestOperationTimestamp: (replicaId: string, timestamp: string) => import("better-sqlite3").RunResult;
    updateLastSeen: (replicaId: string) => import("better-sqlite3").RunResult;
    updateAcknowledged: (replicaId: string, timestamp: string) => import("better-sqlite3").RunResult;
    getGlobalAck: () => any;
}
//# sourceMappingURL=Replicas.d.ts.map