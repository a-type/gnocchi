import { Database } from 'better-sqlite3';
import { ClientConnectionDataSpec } from './types.js';

export class ClientConnectionData {
	constructor(private db: Database, public readonly id: string) {}

	getOrCreate = () => {
		return this.db
			.prepare(
				`
      INSERT OR IGNORE INTO ClientConnectionData (id)
      VALUES (?)
    `,
			)
			.run(this.id);
	};

	updateOldestOperationTimestamp = (timestamp: string) => {
		return this.db
			.prepare(
				`
      UPDATE ClientConnectionData
      SET oldestOperationTimestamp = ?
      WHERE id = ?
    `,
			)
			.run(timestamp, this.id);
	};

	updateLastSeen = (timestamp: string) => {
		const clockTime = new Date().getTime();
		return this.db
			.prepare(
				`
      UPDATE ClientConnectionData
      SET lastSeenLogicalTime = ?, lastSeenWallClockTime = ?
      WHERE id = ?
    `,
			)
			.run(timestamp, clockTime, this.id);
	};
}

export class ClientConnectionDataManager {
	private cache = new Map<string, ClientConnectionData>();

	constructor(private db: Database) {}

	open = (id: string) => {
		if (!this.cache.has(id)) {
			this.cache.set(id, new ClientConnectionData(this.db, id));
		}

		return this.cache.get(id)!;
	};

	allForLibrary = (libraryId: string) => {
		const clients = this.db
			.prepare(
				`
        SELECT id
        FROM ClientConnectionData
        WHERE libraryId = ?
      `,
			)
			.all(libraryId) as ClientConnectionDataSpec[];
		return clients;
	};

	close = (id: string) => {
		this.cache.delete(id);
	};
}
