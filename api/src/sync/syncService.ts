import { parse, PatchMessage } from '@aglio/common';
import { applyOperation, Operation } from 'fast-json-patch';
import { Session } from '../auth/session';
import { prisma } from '../data/prisma';

export class SyncService {
	handleMessage = (message: string, session: Session) => {
		const parsed = parse(message);

		switch (parsed.type) {
			case 'ping':
				return;
			case 'patch':
				return this.handlePatch(parsed, session);
			default:
				throw new Error(`Unknown message type: ${message}`);
		}
	};

	handlePatch = async (patch: PatchMessage, session: Session) => {
		const patches = patch.patch as Operation[];
		// group patches by document id
		const patchesByDocumentId = patches.reduce((acc, patch) => {
			// first two segments of path are [collection]/[id]
			const [_, collection, id, ...path] = patch.path.split('/');

			if (!acc[id]) {
				acc[id] = {
					id,
					collection,
					operations: [],
				};
			}

			// rewrite path to remove collection/id
			patch.path = '/' + path.join('/');
			acc[id].operations.push(patch);
			return acc;
		}, {} as { [documentId: string]: { id: string; collection: string; operations: Operation[] } });

		for (const { operations, id, collection } of Object.values(
			patchesByDocumentId,
		)) {
			if (
				operations.length === 1 &&
				operations[0].op === 'add' &&
				operations[0].path === '/'
			) {
				const patch = operations[0];
				console.log('inserting new document', patch.value);
				const data = patch.value;
				await prisma.document.upsert({
					where: { id },
					create: {
						id,
						collection,
						contents: JSON.stringify(data),
						planId: session.planId,
					},
					update: {
						contents: JSON.stringify(data),
					},
				});
			} else if (
				operations.length === 1 &&
				operations[0].op === 'remove' &&
				operations[0].path === '/'
			) {
				console.log('deleting document', id);
				const document = await prisma.document.findUnique({
					where: {
						id,
					},
				});
				if (document) {
					if (document.planId !== session.planId) {
						throw new Error('Not authorized');
					}
					await prisma.document.delete({
						where: {
							id,
						},
					});
				}
			} else {
				await this.applyPatchOnDocument(id, operations, session);
			}
		}
	};

	private applyPatchOnDocument = async (
		id: string,
		operations: Operation[],
		session: Session,
	) => {
		for (const patch of operations) {
			if (
				patch.op === 'replace' ||
				patch.op === 'add' ||
				patch.op === 'remove'
			) {
				await this.applyOperationOnDocument(id, patch, session);
			} else {
				throw new Error('Unsupported operation ' + patch.op);
			}
		}
	};

	private applyOperationOnDocument = async (
		id: string,
		patch: Operation,
		session: Session,
	) => {
		// lookup doc
		const document = await prisma.document.findUnique({
			where: {
				id,
			},
		});

		if (!document) {
			throw new Error(`Document not found: ${id}`);
		}

		if (document.planId !== session.planId) {
			throw new Error('Not authorized');
		}

		console.log('applying', patch, 'on', document.id);
		const json = JSON.parse(document.contents);
		const result = applyOperation(json, patch);
		return prisma.document.update({
			where: {
				id,
			},
			data: {
				contents: JSON.stringify(result.newDocument),
			},
		});
	};
}

export const syncService = new SyncService();
