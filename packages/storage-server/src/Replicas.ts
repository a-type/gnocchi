import { ReplicaInfo, SERVER_REPLICA_ID } from '@aglio/storage-common';
import { Database } from 'better-sqlite3';
import { ReplicaInfoSpec } from './types.js';

export class ReplicaInfos {
	constructor(private db: Database, private libraryId: string) {}

	getOrCreate = (
		replicaId: string,
		clientId: string | null,
	): ReplicaInfoSpec => {
		if (replicaId !== SERVER_REPLICA_ID && clientId === null) {
			throw new Error('Client ID must be provided for non-server replicas');
		}

		this.db
			.prepare(
				`
      INSERT OR IGNORE INTO ReplicaInfo (id, libraryId, clientId)
      VALUES (?, ?, ?)
    `,
			)
			.run(replicaId, this.libraryId, clientId);
		return this.db
			.prepare(
				`
			SELECT * FROM ReplicaInfo
			WHERE id = ?
			`,
			)
			.get(replicaId);
	};

	getAll = (): ReplicaInfoSpec[] => {
		return this.db
			.prepare(
				`
			SELECT * FROM ReplicaInfo
			WHERE libraryId = ?
		`,
			)
			.all(this.libraryId);
	};

	updateOldestOperationTimestamp = (replicaId: string, timestamp: string) => {
		return this.db
			.prepare(
				`
      UPDATE ReplicaInfo
      SET oldestOperationTimestamp = ?
      WHERE id = ?
    `,
			)
			.run(timestamp, replicaId);
	};

	updateLastSeen = (replicaId: string, timestamp: string) => {
		const clockTime = new Date().getTime();
		return this.db
			.prepare(
				`
      UPDATE ReplicaInfo
      SET lastSeenLogicalTime = ?, lastSeenWallClockTime = ?
      WHERE id = ?
    `,
			)
			.run(timestamp, clockTime, replicaId);
	};

	updateAcknowledged = (replicaId: string, timestamp: string) => {};
}
