import { Database } from 'better-sqlite3';
import { ClientMessage } from '@aglio/storage-common';
import { ServerLibraryManager } from './ServerLibrary.js';
import { MessageSender } from './MessageSender.js';

export class ServerStorage {
	private libraries = new ServerLibraryManager(this.db, this.sender);

	constructor(private db: Database, private sender: MessageSender) {
		this.createSchema();
	}

	receive = (libraryId: string, message: ClientMessage, clientId: string) => {
		const library = this.libraries.open(libraryId);
		library.receive(message, clientId);
	};

	createSchema = () => {
		const run = this.db.transaction(() => {
			this.db
				.prepare(
					`
        CREATE TABLE IF NOT EXISTS ClientConnectionData (
          id TEXT PRIMARY KEY,
          libraryId: TEXT,
          lastSeenWallClockTime INTEGER,
          lastSeenLogicalTime TEXT,
          oldestOperationLogicalTime TEXT
        );
      `,
				)
				.run();

			this.db
				.prepare(
					`
        CREATE TABLE IF NOT EXISTS OperationHistory (
					id TEXT PRIMARY KEY,
          libraryId TEXT,
          collection TEXT,
          documentId TEXT,
          patch TEXT,
          timestamp INTEGER
        );
      `,
				)
				.run();

			this.db
				.prepare(
					`
        CREATE TABLE IF NOT EXISTS DocumentBaseline (
          documentId TEXT PRIMARY KEY,
          snapshot JSON,
          timestamp TEXT
        );
      `,
				)
				.run();

			this.db
				.prepare(
					`
        CREATE TABLE IF NOT EXISTS Document (
          id TEXT PRIMARY KEY,
          libraryId TEXT,
          collection TEXT,
          snapshot JSON,
          timestamp TEXT
        );
      `,
				)
				.run();
		});

		run();
	};
}
