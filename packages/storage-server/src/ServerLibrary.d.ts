import { ClientMessage } from '@aglio/storage-common';
import { Database } from 'better-sqlite3';
import { MessageSender } from './MessageSender.js';
export declare class ServerLibrary {
    private db;
    private sender;
    readonly id: string;
    private collections;
    private replicas;
    private operations;
    private baselines;
    constructor(db: Database, sender: MessageSender, id: string);
    receive: (message: ClientMessage, clientId: string) => void;
    private handleOperation;
    private rebroadcastOperations;
    private handleSync;
    private handleSyncStep2;
    private setupServerReplica;
    private handleAck;
    private pendingRebaseTimeout;
    private enqueueRebase;
    private rebase;
}
export declare class ServerLibraryManager {
    private db;
    private sender;
    private cache;
    constructor(db: Database, sender: MessageSender);
    open: (id: string) => ServerLibrary;
    close: (id: string) => void;
}
//# sourceMappingURL=ServerLibrary.d.ts.map