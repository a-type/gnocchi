import {
	addOid,
	getOid,
	initialToPatches,
	isObjectRef,
	NormalizedObject,
	ObjectIdentifier,
	ObjectWithIdentifier,
	OperationPatch,
	PropertyValue,
	substituteFirstLevelObjectsWithRefs,
	SyncOperation,
} from '@aglio/storage-common';
import { assert } from '@aglio/tools';

export const UPDATE = '@@update';

export interface LiveMutations {
	applyOperation(op: Pick<SyncOperation, 'patches'>): void;
	createObject(): ObjectIdentifier;
}

export function createDocument<T extends ObjectWithIdentifier>(
	mutations: LiveMutations,
	initial: T,
): Document<T> {
	assert(!Array.isArray(initial), 'Cannot create a document from a list');
	const rawChildObjects = substituteFirstLevelObjectsWithRefs(initial);
	return new Document(mutations, initial, rawChildObjects);
}

function createLiveObject<T extends ObjectWithIdentifier>(
	mutations: LiveMutations,
	initial: T,
) {
	if (Array.isArray(initial)) {
		const rawChildObject = substituteFirstLevelObjectsWithRefs(initial);
		const list = new LiveList(mutations, initial, rawChildObject);
		return list;
	} else {
		const rawChildObjects = substituteFirstLevelObjectsWithRefs(initial);
		const obj = new LiveObject(mutations, initial, rawChildObjects);
		return obj;
	}
}

export function updateLiveObject<T extends ObjectWithIdentifier>(
	obj: LiveBase<T>,
	newValue: T,
) {
	if (Array.isArray(newValue)) {
		const rawChildObject = substituteFirstLevelObjectsWithRefs(newValue);
		(obj as any).replace(newValue, rawChildObject);
	} else {
		const rawChildObjects = substituteFirstLevelObjectsWithRefs(newValue);
		(obj as any).replace(newValue, rawChildObjects);
	}
}

export abstract class LiveBase<
	T extends ObjectWithIdentifier,
	PublicValue = T,
> {
	protected _current: NormalizedObject | null = null;
	protected _updated: NormalizedObject | null = null;
	protected _activePatchLists: OperationPatch[][] = [];
	protected _updatesQueued = false;

	get oid() {
		return this.value ? getOid(this.value) : null;
	}

	protected get value() {
		return this._updated || this._current;
	}

	protected get currentPatchList() {
		if (this._activePatchLists.length === 0) {
			this._activePatchLists.push([]);
		}
		return this._activePatchLists[this._activePatchLists.length - 1];
	}

	constructor(
		readonly mutations: LiveMutations,
		protected rawChildObjects: Map<ObjectIdentifier, any>,
	) {}

	protected abstract [UPDATE](
		initial: T | undefined,
		rawChildObjects: Map<ObjectIdentifier, any>,
	): void;

	protected flush = () => {
		const patchLists = this._activePatchLists;
		if (patchLists.length > 0) {
			for (const patchList of patchLists) {
				this.mutations.applyOperation({
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
		if (this.currentPatchList.length > 0) {
			this._activePatchLists.push([]);
		}
	};

	dispose = () => {
		// TODO: implement
	};
}

export class LiveObject<T extends ObjectWithIdentifier> extends LiveBase<T> {
	protected _children = new Map<keyof T, LiveList<any> | LiveObject<any>>();

	constructor(
		mutations: LiveMutations,
		initial: T,
		rawChildObjects: Map<ObjectIdentifier, any>,
	) {
		super(mutations, rawChildObjects);
		this[UPDATE](initial, rawChildObjects);
	}

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
				// TODO: this
			} else {
				// sub-objects are created via diff patches applied to their oid
				// but we also need to recursively create nested sub-objects...
				const subObjectOid = this.mutations.createObject();
				this.currentPatchList.push(
					...initialToPatches({
						'@@oid': subObjectOid,
						...value,
					}),
				);
				this.currentPatchList.push({
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
			this.currentPatchList.push({
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
			if (isObjectRef(normalized)) {
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
			}
		} else {
			return normalized;
		}
	};

	update = (changes: Partial<T>) => {
		// TODO: implement
	};
}

export class Document<T extends ObjectWithIdentifier> extends LiveObject<T> {
	delete = () => {
		// TODO: implement
	};
}

class LiveList<
	T extends Array<any> & { '@@oid': ObjectIdentifier },
> extends LiveBase<T> {
	private _children: LiveBase<any>[] = [];

	constructor(
		mutations: LiveMutations,
		initial: T,
		rawChildObjects: Map<ObjectIdentifier, any>,
	) {
		super(mutations, rawChildObjects);
		this[UPDATE](initial, rawChildObjects);
	}

	get length() {
		return this.value?.length || 0;
	}

	get = (index: number) => {
		const value = this.value?.[index];
		if (value && isObjectRef(value)) {
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
		} else {
			return value;
		}
	};

	[UPDATE](init: T, rawChildObjects: Map<ObjectIdentifier, any>) {
		this._updated = null;
		this._current = init as any;
		this.rawChildObjects = rawChildObjects;

		// update child values for each id, drop any that are no longer present

		for (let i = 0; i < init.length; i++) {
			const value = init[i];
			if (value && isObjectRef(value)) {
				const child = this._children[i];
				if (child) {
					if (child instanceof LiveObject) {
						if (child.oid === value.id) {
							// no change
							continue;
						}
						// identity changed
						updateLiveObject(child, this.rawChildObjects.get(value.id)!);
					} else if (child instanceof LiveList) {
						// TODO: what?
					}
				}
			}
		}
	}

	set = (index: number, value: T[number]) => {
		if (!this.value) throw new Error('TODO: message');
		if (value && typeof value === 'object') {
			const child = this._children[index];
			if (Array.isArray(child)) {
				// TODO: this
			} else {
				// sub-objects are created via diff patches applied to their oid
				// but we also need to recursively create nested sub-objects...
				const subObjectOid = this.mutations.createObject();
				this.currentPatchList.push(
					...initialToPatches({
						'@@oid': subObjectOid,
						...value,
					}),
				);
				this.currentPatchList.push({
					op: 'list-set',
					oid: getOid(this.value),
					index,
					value: {
						'@@type': 'ref',
						id: subObjectOid,
					},
				});
				// TODO: optimistic update

				if (child instanceof LiveObject) {
					updateLiveObject(child, addOid(value, subObjectOid));
				}
			}
		} else {
			this.currentPatchList.push({
				op: 'list-set',
				oid: getOid(this.value),
				index,
				value,
			});
		}

		this.enqueueUpdates();
	};

	push = (value: T[number]) => {
		if (!this.value) throw new Error('TODO: message');
		if (value && typeof value === 'object') {
			// sub-objects are created via diff patches applied to their oid
			// but we also need to recursively create nested sub-objects...
			const subObjectOid = this.mutations.createObject();
			this.currentPatchList.push(
				...initialToPatches({
					'@@oid': subObjectOid,
					...value,
				}),
			);
			this.currentPatchList.push({
				op: 'list-push',
				oid: getOid(this.value),
				value: {
					'@@type': 'ref',
					id: subObjectOid,
				},
			});

			// TODO: optimistic update
		} else {
			this.currentPatchList.push({
				op: 'list-push',
				oid: getOid(this.value),
				value,
			});
		}

		this.enqueueUpdates();
	};

	// TODO: implement all the other list methods
}
