import { applyPatch, Message, OperationMessage } from '@aglio/storage-common';
import { Database } from 'better-sqlite3';
import { OperationHistory } from './OperationHistory.js';
import { OperationHistoryItemSpec } from './types.js';

export class ServerCollection {
	private operationHistory = new OperationHistory(this.db, this.libraryId);

	constructor(
		private db: Database,
		public readonly libraryId: string,
		public readonly name: string,
	) {}

	/**
	 * Applies an operation, inserting it into the operation history
	 * and recomputing the document snapshot.
	 */
	receive = (message: OperationMessage) => {
		const run = this.db.transaction(() => {
			// insert operation into history for the document
			this.operationHistory.insert({
				id: message.id,
				replicaId: message.replicaId,
				collection: this.name,
				documentId: message.documentId,
				patch: message.patch,
				timestamp: message.timestamp,
			});

			// read operation history for affected document
			const history = this.operationHistory.getAllFor(message.documentId);

			// reapply operations to baseline to reconstruct document -
			// assume empty document if no baseline exists.
			const baseline = this.db
				.prepare(
					`
					SELECT snapshot, timestamp
					FROM DocumentBaseline
					WHERE documentId = ?
					ORDER BY timestamp DESC
					LIMIT 1
				`,
				)
				.get(message.documentId);

			const baselineSnapshot = baseline.snapshot || {};
			const updatedView = this.applyOperations(baselineSnapshot, history);

			// update document
			this.db
				.prepare(
					`
					INSERT OR REPLACE INTO Document (documentId, snapshot, timestamp)
					VALUES (?, ?, ?)
				`,
				)
				.run(message.documentId, updatedView, message.timestamp);
		});

		run();
	};

	private applyOperations = <T>(
		baseline: T,
		operations: OperationHistoryItemSpec[],
	) => {
		let result: T | undefined = baseline;
		for (const operation of operations) {
			result = this.applyOperation(result, operation);
		}

		return result;
	};

	private applyOperation = <T>(
		baseline: T,
		operation: OperationHistoryItemSpec,
	) => {
		return applyPatch<T>(baseline, operation.patch);
	};
}

export class ServerCollectionManager {
	private cache = new Map<string, ServerCollection>();

	constructor(private db: Database, public readonly libraryId: string) {}

	open = (name: string) => {
		if (!this.cache.has(name)) {
			this.cache.set(name, new ServerCollection(this.db, this.libraryId, name));
		}

		return this.cache.get(name)!;
	};

	close = (name: string) => {
		this.cache.delete(name);
	};
}
