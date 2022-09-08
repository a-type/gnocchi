import { Database } from 'better-sqlite3';
import { ClientMessage } from '@aglio/storage-common';
import { ServerLibraryManager } from './ServerLibrary.js';
import { MessageSender } from './MessageSender.js';
import { UserProfiles, UserProfileLoader } from './Profiles.js';

export class ServerStorage {
	private profileLoader;
	private libraries;

	constructor(
		private db: Database,
		private sender: MessageSender,
		profiles: UserProfiles<any>,
	) {
		this.createSchema();
		this.profileLoader = new UserProfileLoader(profiles);
		this.libraries = new ServerLibraryManager(
			this.db,
			this.sender,
			this.profileLoader,
		);
	}

	receive = (libraryId: string, message: ClientMessage, clientId: string) => {
		// TODO: validate clientID access to replicaID on the message.

		console.debug('Received message', libraryId, clientId, message);

		const library = this.libraries.open(libraryId);
		library.receive(message, clientId);
	};

	private createSchema = () => {
		const run = this.db.transaction(() => {
			this.db
				.prepare(
					`
        CREATE TABLE IF NOT EXISTS ReplicaInfo (
          id TEXT PRIMARY KEY NOT NULL,
          libraryId TEXT NOT NULL,
					clientId TEXT NOT NULL,
          lastSeenWallClockTime INTEGER,
          ackedLogicalTime TEXT,
          oldestOperationLogicalTime TEXT
        );
      `,
				)
				.run();

			this.db
				.prepare(
					`
        CREATE TABLE IF NOT EXISTS OperationHistory (
					id TEXT PRIMARY KEY NOT NULL,
          libraryId TEXT NOT NULL,
					replicaId TEXT NOT NULL,
          collection TEXT NOT NULL,
          documentId TEXT NOT NULL,
          patch TEXT NOT NULL,
          timestamp INTEGER NOT NULL
        );
      `,
				)
				.run();

			this.db
				.prepare(
					`
        CREATE TABLE IF NOT EXISTS DocumentBaseline (
          documentId TEXT PRIMARY KEY NOT NULL,
          snapshot TEXT,
          timestamp TEXT NOT NULL,
					libraryId TEXT NOT NULL
        );
      `,
				)
				.run();

			this.db
				.prepare(
					`
        CREATE TABLE IF NOT EXISTS Document (
          id TEXT PRIMARY KEY NOT NULL,
          libraryId TEXT NOT NULL,
          collection TEXT NOT NULL,
          snapshot TEXT,
          timestamp TEXT NOT NULL
        );
      `,
				)
				.run();
		});

		run();
	};
}
