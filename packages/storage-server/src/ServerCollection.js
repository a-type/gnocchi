import { applyPatch, } from '@aglio/storage-common';
import { Baselines } from './Baselines.js';
import { OperationHistory } from './OperationHistory.js';
export class ServerCollection {
    constructor(db, libraryId, name) {
        this.db = db;
        this.libraryId = libraryId;
        this.name = name;
        this.operationHistory = new OperationHistory(this.db, this.libraryId);
        this.baselines = new Baselines(this.db, this.libraryId);
        /**
         * Applies an operation, inserting it into the operation history
         * and recomputing the document snapshot.
         */
        this.receive = ({ op }) => {
            const run = this.db.transaction(() => {
                // insert operation into history for the document
                this.operationHistory.insert({
                    id: op.id,
                    replicaId: op.replicaId,
                    collection: this.name,
                    documentId: op.documentId,
                    patch: op.patch,
                    timestamp: op.timestamp,
                });
                // read operation history for affected document
                const history = this.operationHistory.getAllFor(op.documentId);
                // reapply operations to baseline to reconstruct document -
                // assume empty document if no baseline exists.
                const baseline = this.baselines.get(op.documentId);
                const baselineSnapshot = (baseline === null || baseline === void 0 ? void 0 : baseline.snapshot) || {};
                const updatedView = this.applyOperations(baselineSnapshot, history);
                // update document
                this.db
                    .prepare(`
					INSERT OR REPLACE INTO Document (id, libraryId, collection, snapshot, timestamp)
					VALUES (?, ?, ?, ?, ?)
				`)
                    .run(op.documentId, this.libraryId, this.name, JSON.stringify(updatedView), op.timestamp);
            });
            run();
        };
        this.applyOperations = (baseline, operations) => {
            let result = baseline;
            for (const operation of operations) {
                result = this.applyOperation(result, operation);
            }
            return result;
        };
        this.applyOperation = (baseline, operation) => {
            return applyPatch(baseline, operation.patch);
        };
    }
}
export class ServerCollectionManager {
    constructor(db, libraryId) {
        this.db = db;
        this.libraryId = libraryId;
        this.cache = new Map();
        this.open = (name) => {
            if (!this.cache.has(name)) {
                this.cache.set(name, new ServerCollection(this.db, this.libraryId, name));
            }
            return this.cache.get(name);
        };
        this.close = (name) => {
            this.cache.delete(name);
        };
    }
}
//# sourceMappingURL=ServerCollection.js.map