import {
	getOid,
	initialToPatches,
	isObjectRefList,
	isObjectRefSingle,
	NormalizedObject,
	ObjectIdentifier,
	ObjectWithIdentifier,
	OperationPatch,
	PropertyValue,
	substituteFirstLevelObjectsWithRefs,
	SyncOperation,
} from '@aglio/storage-common';

export const UPDATE = '@@update';

export interface LiveMutations {
	applyOperation(op: Pick<SyncOperation, 'rootOid' | 'patches'>): void;
	createObject(): ObjectIdentifier;
}

function createLiveObject<T extends ObjectWithIdentifier>(
	mutations: LiveMutations,
	initial: T,
) {
	const rawChildObjects = substituteFirstLevelObjectsWithRefs(initial);
	return new LiveObject(mutations, initial, rawChildObjects);
}

function updateLiveObject<T extends ObjectWithIdentifier>(
	obj: LiveObject<T>,
	newValue: T,
) {
	const rawChildObjects = substituteFirstLevelObjectsWithRefs(newValue);
	obj[UPDATE](newValue, rawChildObjects);
}

function createLiveList<T extends ObjectWithIdentifier>(
	mutations: LiveMutations,
	initial: T[],
) {
	const rawChildObjects = substituteFirstLevelObjectsWithRefs(initial);
	return new LiveList(mutations, initial, rawChildObjects);
}

function updateLiveList<T extends ObjectWithIdentifier>(
	list: LiveList<T>,
	newValue: T[],
) {
	const rawChildObjects = substituteFirstLevelObjectsWithRefs(newValue);
	list[UPDATE](newValue, rawChildObjects);
}

export abstract class LiveBase<T extends ObjectWithIdentifier> {
	protected _current: NormalizedObject | null = null;
	protected _updated: NormalizedObject | null = null;
	protected _activePatchLists: OperationPatch[][] = [];
	protected _updatesQueued = false;
	protected _children = new Map<keyof T, LiveList<any> | LiveObject<any>>();

	get oid() {
		return this.value ? getOid(this.value) : null;
	}

	constructor(
		readonly mutations: LiveMutations,
		initial: T,
		protected rawChildObjects: Map<ObjectIdentifier, any>,
	) {
		this[UPDATE](initial, rawChildObjects);
	}

	abstract [UPDATE](
		initial: T | undefined,
		rawChildObjects: Map<ObjectIdentifier, any>,
	): void;

	get value() {
		return this._updated || this._current;
	}

	protected flush = () => {
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

	protected enqueueUpdates() {
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
}

export class LiveObject<T extends ObjectWithIdentifier> extends LiveBase<T> {
	[UPDATE] = (
		value: T | undefined,
		rawChildObjects: Map<ObjectIdentifier, any>,
	) => {
		const base = {
			...value,
		};
		this.rawChildObjects = rawChildObjects;
		this._current = base ?? null;
		// update lists and objects
		for (const key of Object.keys(base)) {
			const child = this._children.get(key as keyof T);
			if (child instanceof LiveBase) {
				updateLiveObject(child, base[key]);
			}
		}
	};
	/**
	 * Sets a single key to a value
	 */
	set = <Key extends keyof T>(key: Key, value: T[Key]) => {
		if (!this.value) {
			throw new Error('Cannot set property on null document');
		}
		this._updated = this._updated || { ...this._current! };
		if (!!value && typeof value === 'object') {
			if (Array.isArray(value)) {
			} else {
				// sub-objects are created via diff patches applied to their oid
				// but we also need to recursively create nested sub-objects...
				const subObjectOid = this.mutations.createObject();
				this._activePatchLists[this._activePatchLists.length - 1].push(
					...initialToPatches({
						'@@oid': subObjectOid,
						...value,
					}),
				);
				this._activePatchLists[this._activePatchLists.length - 1].push({
					op: 'set',
					name: key.toString(),
					oid: this.oid,
					value: {
						'@@type': 'ref',
						id: subObjectOid,
					},
				});
				this._updated[key as any] = {
					'@@type': 'ref',
					id: subObjectOid,
				};
			}
		} else {
			this._updated[key as any] = value as PropertyValue;
			this._activePatchLists[this._activePatchLists.length - 1].push({
				op: 'set',
				name: key.toString(),
				oid: this.oid,
				value: value as string | number | boolean | null | undefined,
			});
		}

		this.enqueueUpdates();
	};

	/**
	 * Gets a value of a key
	 */
	get = <Key extends keyof T>(key: Key): any => {
		/**
		 * Gets a property from the document.
		 * If the property value is a sub-object, a LiveObject instance is returned. These instances
		 *   are cached so they'll be the same if retrieved multiple times.
		 * If the property value is a list, a LiveList instance is returned.
		 *
		 * Sub-objects will be re-created if their identity changes since the last cached value.
		 */

		if (!this.value) {
			throw new Error('Cannot get property on null document');
		}

		const normalized = this.value![key as any];
		if (normalized && typeof normalized === 'object') {
			if (normalized['@@type'] === 'ref') {
				const oid = normalized.id;
				if (this._children.has(key)) {
					const child = this._children.get(key)!;
					if (child instanceof LiveObject && child.oid === oid) {
						return child;
					}
					// object identity changed, so we need to create a new object
				}
				if (!this.rawChildObjects.has(oid)) {
					throw new Error('Cannot find child object');
				}
				const child = createLiveObject(
					this.mutations,
					this.rawChildObjects.get(oid)!,
				);
				this._children.set(key, child);
				return child;
			} else if (normalized['@@type'] === 'ref-list') {
				let list = this._children.get(key);
				if (!list || !(list instanceof LiveList)) {
					list = new LiveList(
						this.mutations,
						normalized.ids,
						this.rawChildObjects,
					);
					this._children.set(key, list);
				}
				return list;
			}
		} else {
			return normalized;
		}
	};

	update = (changes: Partial<T>) => {
		// TODO: implement
	};
}

export class Document<T extends ObjectWithIdentifier> extends LiveObject<T> {}

class LiveList<T> {
	private _children: (LiveObject<any> | LiveList<any>)[] = [];

	constructor(
		private readonly mutations: LiveMutations,
		private values: T[],
		private rawChildObjects: Map<ObjectIdentifier, any>,
	) {}

	get length() {
		return this.values.length;
	}

	get = (index: number) => {
		const value = this.values[index];
		if (value && isObjectRefSingle(value)) {
			const id = value.id;
			if (!id) {
				throw new Error('Invalid index');
			}
			const child = this._children[index];
			if (child instanceof LiveObject && child.oid === id) {
				return child;
			}
			if (!this.rawChildObjects.has(id)) {
				throw new Error('Cannot find child object');
			}
			const newChild = createLiveObject(
				this.mutations,
				this.rawChildObjects.get(id)!,
			);
			this._children[index] = newChild;
			return newChild;
		} else if (value && isObjectRefList(value)) {
			let list = this._children[index];
			if (!list || !(list instanceof LiveList)) {
				list = new LiveList(this.mutations, value.ids, this.rawChildObjects);
				this._children[index] = list;
			}
			return list;
		} else {
			return value;
		}
	};

	[UPDATE](values: T[], rawChildObjects: Map<ObjectIdentifier, any>) {
		this.values = values;
		this.rawChildObjects = rawChildObjects;

		// update child values for each id, drop any that are no longer present

		for (let i = 0; i < this.values.length; i++) {
			const value = this.values[i];
			if (value && isObjectRefSingle(value)) {
				const child = this._children[i];
				if (child) {
					if (child instanceof LiveBase) {
						if (child.oid === value.id) {
							// no change
							continue;
						}
						// identity changed
						updateLiveObject(child, this.rawChildObjects.get(value.id)!);
					}
				}
			} else if (isObjectRefList(value)) {
				throw new Error('Nested lists arent supported yet');
			}
		}
	}

	set = (index: number, value: T) => {
		if (value && typeof value === 'object') {
		}
	};

	push = (value: T) => {};

	// TODO: implement all the other list methods
}
