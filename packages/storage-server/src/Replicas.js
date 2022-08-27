import { SERVER_REPLICA_ID } from '@aglio/storage-common';
export class ReplicaInfos {
    constructor(db, libraryId) {
        this.db = db;
        this.libraryId = libraryId;
        this.getOrCreate = (replicaId, clientId) => {
            if (replicaId !== SERVER_REPLICA_ID && clientId === null) {
                throw new Error('Client ID must be provided for non-server replicas');
            }
            this.db
                .prepare(`
      INSERT OR IGNORE INTO ReplicaInfo (id, libraryId, clientId)
      VALUES (?, ?, ?)
    `)
                .run(replicaId, this.libraryId, clientId);
            return this.db
                .prepare(`
			SELECT * FROM ReplicaInfo
			WHERE id = ?
			`)
                .get(replicaId);
        };
        this.getAll = () => {
            return this.db
                .prepare(`
			SELECT * FROM ReplicaInfo
			WHERE libraryId = ?
		`)
                .all(this.libraryId);
        };
        this.updateOldestOperationTimestamp = (replicaId, timestamp) => {
            return this.db
                .prepare(`
      UPDATE ReplicaInfo
      SET oldestOperationLogicalTime = ?
      WHERE id = ?
    `)
                .run(timestamp, replicaId);
        };
        this.updateLastSeen = (replicaId) => {
            const clockTime = new Date().getTime();
            return this.db
                .prepare(`
      UPDATE ReplicaInfo
      SET lastSeenWallClockTime = ?
      WHERE id = ?
    `)
                .run(clockTime, replicaId);
        };
        this.updateAcknowledged = (replicaId, timestamp) => {
            return this.db
                .prepare(`
			UPDATE ReplicaInfo
			SET ackedLogicalTime = ?
			WHERE id = ?
		`)
                .run(timestamp, replicaId);
        };
        this.getGlobalAck = () => {
            return this.db
                .prepare(`
			SELECT MIN(ackedLogicalTime) AS ackedLogicalTime
			FROM ReplicaInfo
			WHERE libraryId = ?
		`)
                .get(this.libraryId).ackedLogicalTime;
        };
    }
}
//# sourceMappingURL=Replicas.js.map