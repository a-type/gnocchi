export class OperationHistory {
    constructor(db, libraryId) {
        this.db = db;
        this.libraryId = libraryId;
        this.hydrateOperation = (operation) => {
            return Object.assign(Object.assign({}, operation), { patch: JSON.parse(operation.patch) });
        };
        this.getAllFor = (documentId) => {
            return this.db
                .prepare(`
      SELECT * FROM OperationHistory
      WHERE libraryId = ? AND documentId = ?
      ORDER BY timestamp ASC
    `)
                .all(this.libraryId, documentId)
                .map(this.hydrateOperation);
        };
        this.getEarliest = (count) => {
            return this.db
                .prepare(`
      SELECT * FROM OperationHistory
      WHERE libraryId = ?
      ORDER BY timestamp ASC
      LIMIT ?
    `)
                .all(this.libraryId, count)
                .map(this.hydrateOperation);
        };
        this.getAfter = (timestamp = null) => {
            if (timestamp === null) {
                return this.db
                    .prepare(`
					SELECT * FROM OperationHistory
					WHERE libraryId = ?
					ORDER BY timestamp ASC
				`)
                    .all(this.libraryId)
                    .map(this.hydrateOperation);
            }
            return this.db
                .prepare(`
      SELECT * FROM OperationHistory
      WHERE libraryId = ? AND timestamp > ?
      ORDER BY timestamp ASC
    `)
                .all(this.libraryId, timestamp)
                .map(this.hydrateOperation);
        };
        /**
         * Returns all operations before the given timestamp
         * in ascending chronological order
         */
        this.getBefore = (before) => {
            return this.db
                .prepare(`
			SELECT * FROM OperationHistory
			WHERE libraryId = ? AND timestamp < ?
			ORDER BY timestamp ASC
		`)
                .all(this.libraryId, before)
                .map(this.hydrateOperation);
        };
        this.insert = (item) => {
            return this.db
                .prepare(`
      INSERT OR REPLACE INTO OperationHistory (id, libraryId, collection
      , documentId, patch, timestamp, replicaId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
                .run(item.id, this.libraryId, item.collection, item.documentId, JSON.stringify(item.patch), item.timestamp, item.replicaId);
        };
        this.insertAll = async (items) => {
            const insertStatement = this.db.prepare(`
			INSERT OR REPLACE INTO OperationHistory (id, libraryId, collection
			, documentId, patch, timestamp, replicaId)
			VALUES (?, ?, ?, ?, ?, ?, ?)
			`);
            const tx = this.db.transaction(() => {
                for (const item of items) {
                    insertStatement.run(item.id, this.libraryId, item.collection, item.documentId, JSON.stringify(item.patch), item.timestamp, item.replicaId);
                }
            });
            tx();
        };
        this.dropAll = async (items) => {
            const deleteStatement = this.db.prepare(`
			DELETE FROM OperationHistory
			WHERE id = ?
			`);
            this.db.transaction(() => {
                for (const item of items) {
                    deleteStatement.run(item.id);
                }
            })();
        };
    }
}
//# sourceMappingURL=OperationHistory.js.map