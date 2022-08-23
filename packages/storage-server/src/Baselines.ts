import { DocumentBaseline } from '@aglio/storage-common';
import { Database } from 'better-sqlite3';
import { DocumentBaselineSpec } from './types.js';

export class Baselines {
	constructor(private db: Database, private libraryId: string) {}

	get = (documentId: string): DocumentBaseline<any> | null => {
		const row = this.db
			.prepare(
				`
      SELECT * FROM DocumentBaseline
      WHERE libraryId = ? AND documentId = ?
    `,
			)
			.get(this.libraryId, documentId);

		if (!row) {
			return null;
		}

		return this.hydrateSnapshot(row);
	};

	set = (documentId: string, snapshot: DocumentBaseline<any>) => {
		return this.db
			.prepare(
				`
      INSERT OR REPLACE INTO DocumentBaseline (libraryId, documentId, snapshot)
      VALUES (?, ?, ?)
    `,
			)
			.run(this.libraryId, documentId, JSON.stringify(snapshot));
	};

	insertAll = (baselines: DocumentBaseline[]) => {
		const tx = this.db.transaction(() => {
			for (const baseline of baselines) {
				this.db
					.prepare(
						`
				INSERT OR REPLACE INTO DocumentBaseline (libraryId, documentId, snapshot)
				VALUES (?, ?, ?)
			`,
					)
					.run(this.libraryId, baseline.documentId, baseline.snapshot);
			}
		});
		tx();
	};

	private hydrateSnapshot = (
		snapshot: DocumentBaselineSpec,
	): DocumentBaseline<any> => {
		return {
			...snapshot,
			snapshot: JSON.parse(snapshot.snapshot),
		};
	};

	getAllAfter = (timestamp: string): DocumentBaseline<any>[] => {
		return this.db
			.prepare(
				`
      SELECT * FROM DocumentBaseline
      WHERE libraryId = ? AND timestamp > ?
      ORDER BY timestamp ASC
    `,
			)
			.all(this.libraryId, timestamp)
			.map(this.hydrateSnapshot);
	};
}
