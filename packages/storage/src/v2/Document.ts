import {
	ObjectIdentifier,
	OperationPatch,
	SyncOperation,
} from '@aglio/storage-common';

export const UPDATE = '@@update';

export interface LiveMutations {
	applyOperation(op: Pick<SyncOperation, 'rootOid' | 'patches'>): void;
	createObject(): ObjectIdentifier;
}

export class LiveBase<T> {
	private _current: T | null = null;
	private _updated: T | null = null;
	private _activePatchLists: OperationPatch[][] = [];
	private _updatesQueued = false;

	constructor(
		readonly oid: ObjectIdentifier,
		readonly mutations: LiveMutations,
		initial?: T,
	) {
		this._current = initial ?? null;
	}

	[UPDATE] = (value: T | undefined) => {
		this._current = value ?? null;
	};

	get current() {
		return this._current;
	}

	private flush = () => {
		const patchLists = this._activePatchLists;
		if (patchLists.length > 0) {
			for (const patchList of patchLists) {
				this.mutations.applyOperation({
					rootOid: this.oid,
					patches: patchList,
				});
			}
		}
		this._activePatchLists = [[]];
		this._updatesQueued = false;
	};

	private enqueueUpdates() {
		if (!this._updatesQueued) {
			this._updatesQueued = true;
			queueMicrotask(() => {
				this._updatesQueued = false;
				this.flush();
			});
		}
	}

	commit = () => {
		// creates a new patch set which will become a separate operation
		if (this._activePatchLists[this._activePatchLists.length - 1].length > 0) {
			this._activePatchLists.push([]);
		}
	};

	set = <Key extends keyof T>(key: Key, value: T[Key]) => {
		if (!this.current) {
			throw new Error('Cannot set property on null document');
		}
		this._updated = this._updated || { ...this._current! };
		if (!!value && typeof value === 'object') {
			// TODO: how do sub-object updates work?
		} else {
			this._updated[key] = value;
			this._activePatchLists[this._activePatchLists.length - 1].push({
				op: 'set',
				name: key.toString(),
				oid: this.oid,
				value: value as string | number | boolean | null | undefined,
			});
		}
	};
}

export class Document<T> extends LiveBase<T> {}
