import { applyPatch, } from '@aglio/storage-common';
export class Baselines {
    constructor(db, libraryId) {
        this.db = db;
        this.libraryId = libraryId;
        this.get = (documentId) => {
            const row = this.db
                .prepare(`
      SELECT * FROM DocumentBaseline
      WHERE libraryId = ? AND documentId = ?
    `)
                .get(this.libraryId, documentId);
            if (!row) {
                return null;
            }
            return this.hydrateSnapshot(row);
        };
        this.set = (baseline) => {
            return this.db
                .prepare(`
      INSERT OR REPLACE INTO DocumentBaseline (libraryId, documentId, snapshot, timestamp)
      VALUES (?, ?, ?, ?)
    `)
                .run(this.libraryId, baseline.documentId, JSON.stringify(baseline.snapshot), baseline.timestamp);
        };
        this.insertAll = (baselines) => {
            const tx = this.db.transaction(() => {
                for (const baseline of baselines) {
                    this.db
                        .prepare(`
				INSERT OR REPLACE INTO DocumentBaseline (libraryId, documentId, snapshot)
				VALUES (?, ?, ?)
			`)
                        .run(this.libraryId, baseline.documentId, baseline.snapshot);
                }
            });
            tx();
        };
        this.hydrateSnapshot = (snapshot) => {
            return Object.assign(Object.assign({}, snapshot), { snapshot: JSON.parse(snapshot.snapshot) });
        };
        this.getAllAfter = (timestamp) => {
            return this.db
                .prepare(`
      SELECT * FROM DocumentBaseline
      WHERE libraryId = ? AND timestamp > ?
      ORDER BY timestamp ASC
    `)
                .all(this.libraryId, timestamp)
                .map(this.hydrateSnapshot);
        };
        this.applyOperations = (documentId, operations) => {
            if (operations.length === 0)
                return;
            let baseline = this.get(documentId);
            if (!baseline) {
                baseline = {
                    documentId,
                    snapshot: {},
                    timestamp: operations[0].timestamp,
                };
            }
            for (const operation of operations) {
                baseline.snapshot = applyPatch(baseline.snapshot, operation.patch);
            }
            baseline.timestamp = operations[operations.length - 1].timestamp;
            this.set(baseline);
        };
    }
}
//# sourceMappingURL=Baselines.js.map