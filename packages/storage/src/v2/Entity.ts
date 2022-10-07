import {
	applyPatch,
	cloneDeep,
	isObjectRef,
	OperationPatch,
	removeOid,
} from '@aglio/storage-common';
import {
	createRef,
	getOid,
	maybeGetOid,
	normalize,
	normalizeFirstLevel,
	ObjectIdentifier,
} from '@aglio/storage-common';
import { EventSubscriber } from '../EventSubscriber.js';
import { EntityStore } from './EntityStore.js';

export const UPDATE = '@@update';

interface CacheEvents {
	onSubscribed: () => void;
	onAllUnsubscribed: () => void;
}

type AccessibleEntityProperty<T> = T extends Array<any>
	? number
	: T extends object
	? keyof T
	: never;

type EntityPropertyValue<T, K extends keyof T | number> = T extends Array<any>
	? T[K] extends Array<any>
		? ListEntity<T[K]>
		: T[K] extends object
		? ObjectEntity<T[K]>
		: T[K]
	: T extends object
	? K extends keyof T
		? T[K] extends Array<any>
			? ListEntity<T[K]>
			: T[K] extends object
			? ObjectEntity<T[K]>
			: T[K]
		: never
	: never;

export function updateEntity(entity: EntityBase<any>, newValue: any) {
	entity[UPDATE](newValue);
}

export abstract class EntityBase<T> {
	// if current is null, the entity was deleted.
	protected _current: any | null = null;
	// while changes are propagating, realtime alterations are set on this
	// object, which overshadows _current.
	protected _override: any | null = null;

	protected subObjectCache: Map<ObjectIdentifier, EntityBase<any>> = new Map();

	protected events = new EventSubscriber<{
		change: () => void;
	}>();

	protected get value() {
		return this._override || this._current;
	}

	constructor(
		readonly oid: ObjectIdentifier,
		initial: T | undefined,
		protected readonly store: EntityStore,
		protected readonly cacheEvents: CacheEvents,
	) {
		this[UPDATE](initial);
	}

	protected [UPDATE] = (initial: T | undefined) => {
		const normalized = normalizeFirstLevel(initial);
		this._current = removeOid(normalized.get(this.oid));
		// update any existing sub-object values
		const droppedKeys = new Set<ObjectIdentifier>();
		const newKeys = new Set<ObjectIdentifier>(normalized.keys());
		newKeys.delete(this.oid); // remove own oid

		for (const [oid, entity] of this.subObjectCache) {
			const incomingValue = normalized.get(oid);
			entity[UPDATE](incomingValue);

			// update our bookkeeping
			if (incomingValue === undefined) {
				droppedKeys.add(oid);
			}
			newKeys.delete(oid);
		}

		// any new keys are new sub-objects that must
		// be created
		for (const oid of newKeys) {
			const value = normalized.get(oid);
			const entity = this.createSubObject(oid, value);
			this.subObjectCache.set(oid, entity);
		}

		// any dropped keys are sub-objects that must be
		// removed
		for (const oid of droppedKeys) {
			this.subObjectCache.delete(oid);
		}

		// clear overrides
		this._override = null;

		this.events.emit('change');
	};

	protected createSubObject = (
		oid: ObjectIdentifier,
		value: any,
	): EntityBase<any> => {
		if (Array.isArray(value)) {
			return new ListEntity(oid, value, this.store, this.cacheEvents);
		} else {
			return new ObjectEntity(oid, value, this.store, this.cacheEvents);
		}
	};

	dispose = () => {
		// TODO: implement
	};

	subscribe = (event: 'change', callback: () => void) => {
		const unsubscribe = this.events.subscribe(event, callback);
		if (this.events.subscriberCount('change') === 1) {
			this.cacheEvents.onSubscribed();
		}

		return () => {
			unsubscribe();
			if (this.events.subscriberCount('change') === 0) {
				queueMicrotask(() => {
					if (this.events.subscriberCount('change') === 0) {
						this.cacheEvents.onAllUnsubscribed();
					}
				});
			}
		};
	};

	protected addPatches = (patches: OperationPatch[]) => {
		this.store.enqueuePatches(patches);
		// immediately apply patches to _override
		this.propagateImmediatePatches(patches);
	};

	/**
	 * When an entity creates patches, it applies them in-memory for
	 * immediate feedback. But not all patches will relate to its immediate
	 * root object. So entities propagate patches downwards to their
	 * sub-objects for in-memory application.
	 */
	protected propagateImmediatePatches = (patches: OperationPatch[]) => {
		for (const patch of patches) {
			if (patch.oid === this.oid) {
				// apply it to _override
				this._override = this._override || cloneDeep(this._current);
				applyPatch(this._override, patch);
			}
		}
		for (const entity of this.subObjectCache.values()) {
			entity.propagateImmediatePatches(patches);
		}
	};

	protected getSubObject = (oid: ObjectIdentifier) => {
		return this.subObjectCache.get(oid);
	};

	get = <Key extends AccessibleEntityProperty<T>>(
		key: Key,
	): EntityPropertyValue<T, Key> => {
		const value = this.value[key];
		if (value === undefined) {
			throw new Error(
				`Property ${key.toString()} does not exist on ${JSON.stringify(
					this.value,
				)}`,
			);
		}
		if (isObjectRef(value)) {
			const oid = value.id;
			const subObject = this.getSubObject(oid);
			if (subObject) {
				return subObject as EntityPropertyValue<T, Key>;
			}
			throw new Error(
				`CACHE MISS: Subobject ${oid} does not exist on ${this.oid}`,
			);
		}
		return value;
	};

	/**
	 * Returns a copy of the entity and all sub-objects as
	 * a plain object or array.
	 */
	getSnapshot = (): T | null => {
		if (!this.value) {
			return null;
		}
		if (Array.isArray(this.value)) {
			return this.value.map((item) => {
				if (isObjectRef(item)) {
					return this.getSubObject(item.id)?.getSnapshot();
				}
				return item;
			}) as T;
		} else {
			const snapshot = { ...this.value };
			for (const [key, value] of Object.entries(snapshot)) {
				if (isObjectRef(value)) {
					snapshot[key] = this.getSubObject(value.id)?.getSnapshot();
				}
			}
			return snapshot as T;
		}
	};
}

export class ListEntity<T> extends EntityBase<T[]> {
	private getItemOid = (item: T) => {
		const itemOid = maybeGetOid(item);
		if (!itemOid || !this.subObjectCache.has(itemOid)) {
			throw new Error(
				`Cannot move object ${JSON.stringify(
					item,
				)} which does not exist in this list`,
			);
		}
		return itemOid;
	};

	set = (index: number, value: T) => {
		this.addPatches(
			this.store.meta.patchCreator.createSet(this.oid, index, value),
		);
	};
	push = (value: T) => {
		this.addPatches(
			this.store.meta.patchCreator.createListPush(this.oid, value),
		);
	};
	insert = (index: number, value: T) => {
		this.addPatches(
			this.store.meta.patchCreator.createListInsert(this.oid, index, value),
		);
	};
	move = (from: number, to: number) => {
		this.addPatches(
			this.store.meta.patchCreator.createListMoveByIndex(this.oid, from, to),
		);
	};
	moveItem = (item: T, to: number) => {
		this.addPatches(
			this.store.meta.patchCreator.createListMoveByRef(
				this.oid,
				createRef(this.getItemOid(item)),
				to,
			),
		);
	};
	delete = (index: number) => {
		this.addPatches(
			this.store.meta.patchCreator.createListDelete(this.oid, index),
		);
	};
	remove = (item: T) => {
		this.addPatches(
			this.store.meta.patchCreator.createListRemove(
				this.oid,
				createRef(this.getItemOid(item)),
			),
		);
	};
}

export class ObjectEntity<T> extends EntityBase<T> {
	set = (key: string, value: any) => {
		this.addPatches(
			this.store.meta.patchCreator.createSet(this.oid, key, value),
		);
	};
	remove = (key: string) => {
		this.addPatches(this.store.meta.patchCreator.createRemove(this.oid, key));
	};
}
