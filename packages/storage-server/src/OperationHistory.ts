import { SyncOperation } from '@aglio/storage-common';
import { Database } from 'better-sqlite3';
import { OperationHistoryItemSpec } from './types.js';

export class OperationHistory {
	constructor(private db: Database, private libraryId: string) {}

	getAllFor = (documentId: string): OperationHistoryItemSpec[] => {
		return this.db
			.prepare(
				`
      SELECT * FROM OperationHistory
      WHERE libraryId = ? AND documentId = ?
      ORDER BY timestamp ASC
    `,
			)
			.all(this.libraryId, documentId);
	};

	getEarliest = (count: number): OperationHistoryItemSpec[] => {
		return this.db
			.prepare(
				`
      SELECT * FROM OperationHistory
      WHERE libraryId = ?
      ORDER BY timestamp ASC
      LIMIT ?
    `,
			)
			.all(this.libraryId, count);
	};

	getAfter = (timestamp: string): OperationHistoryItemSpec[] => {
		return this.db
			.prepare(
				`
      SELECT * FROM OperationHistory
      WHERE libraryId = ? AND timestamp > ?
      ORDER BY timestamp ASC
    `,
			)
			.all(this.libraryId, timestamp);
	};

	insert = (item: SyncOperation) => {
		return this.db
			.prepare(
				`
      INSERT INTO OperationHistory (libraryId, collection
      , documentId, patch, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `,
			)
			.run(
				this.libraryId,
				item.collection,
				item.documentId,
				item.patch,
				item.timestamp,
			);
	};

	insertAll = async (items: SyncOperation[]) => {
		const insertStatement = this.db.prepare(
			`
			INSERT INTO OperationHistory (libraryId, collection
			, documentId, patch, timestamp)
			VALUES (?, ?, ?, ?, ?)
			`,
		);

		this.db.transaction(() => {
			for (const item of items) {
				insertStatement.run(
					this.libraryId,
					item.collection,
					item.documentId,
					item.patch,
					item.timestamp,
				);
			}
		});
	};
}
