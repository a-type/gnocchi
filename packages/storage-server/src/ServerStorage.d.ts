import { Database } from 'better-sqlite3';
import { ClientMessage } from '@aglio/storage-common';
import { MessageSender } from './MessageSender.js';
export declare class ServerStorage {
    private db;
    private sender;
    private libraries;
    constructor(db: Database, sender: MessageSender);
    receive: (libraryId: string, message: ClientMessage, clientId: string) => void;
    private createSchema;
}
//# sourceMappingURL=ServerStorage.d.ts.map