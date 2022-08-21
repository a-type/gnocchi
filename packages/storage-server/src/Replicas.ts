import { Database } from 'better-sqlite3';
import { ReplicaInfoSpec } from './types.js';

export class ReplicaInfoStorage {
	constructor(private db: Database, public readonly id: string) {}

	getOrCreate = (): ReplicaInfoSpec => {
		this.db
			.prepare(
				`
      INSERT OR IGNORE INTO ReplicaInfo (id)
      VALUES (?)
    `,
			)
			.run(this.id);
		return this.db
			.prepare(
				`
			SELECT * FROM ReplicaInfo
			WHERE id = ?
			`,
			)
			.get(this.id);
	};

	updateOldestOperationTimestamp = (timestamp: string) => {
		return this.db
			.prepare(
				`
      UPDATE ReplicaInfo
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
      UPDATE ReplicaInfo
      SET lastSeenLogicalTime = ?, lastSeenWallClockTime = ?
      WHERE id = ?
    `,
			)
			.run(timestamp, clockTime, this.id);
	};
}

export class ReplicaInfoStorageManager {
	private cache = new Map<string, ReplicaInfoStorage>();

	constructor(private db: Database) {}

	open = (id: string) => {
		if (!this.cache.has(id)) {
			this.cache.set(id, new ReplicaInfoStorage(this.db, id));
		}

		return this.cache.get(id)!;
	};

	allForLibrary = (libraryId: string) => {
		const clients = this.db
			.prepare(
				`
        SELECT id
        FROM ReplicaInfo
        WHERE libraryId = ?
      `,
			)
			.all(libraryId) as ReplicaInfoSpec[];
		return clients;
	};

	close = (id: string) => {
		this.cache.delete(id);
	};
}
