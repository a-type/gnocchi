import { assert } from '@aglio/tools';
import { v4 } from 'uuid';

export interface SyncOperation {
	id: string;
	/**
	 * Which replica created the operation.
	 * Remember that 1 client can have multiple replicas
	 * (i.e. multiple devices associated with their account).
	 */
	replicaId: string;
	/**
	 * The object identifier of the root document object.
	 * Any changes in this operation are applied to the root
	 * or a sub-object of the root. An affected sub-object may
	 * be orphaned, though, if this operation is prior to another
	 * one which was already applied and removed the sub-object.
	 */
	rootOid: ObjectIdentifier;
	/**
	 * The changes applied to the document
	 */
	patches: OperationPatch[]; // TODO: encode?
	/**
	 * The logical timestamp the operation was created at.
	 */
	timestamp: string;
}

// export type ObjectIdentifier<
// 	CollectionName extends string = string,
// 	DocumentId extends string = string,
// 	DocumentOid extends string = string,
// > =
// 	| `${CollectionName}/${DocumentId}:${DocumentOid}`
// 	| `${CollectionName}/${DocumentId}:${DocumentOid}#${string}`;
export type ObjectIdentifier = string;

export type ObjectRef = {
	'@@type': 'ref';
	id: ObjectIdentifier;
};

/**
 * A special known type of object which represents
 * an array.
 */
export interface ListObject<T = any> {
	'@@oid': ObjectIdentifier;
	'@@type': 'list';
	items: T[];
}

export function isObjectRef(obj: any): obj is ObjectRef {
	return obj && typeof obj === 'object' && obj['@@type'] === 'ref';
}

export function isListObject(obj: any): obj is ListObject {
	return obj?.['@@type'] === 'list';
}

export type Normalized<T> = {
	[key in keyof T]: T[key] extends Object ? ObjectRef : T[key];
};

// patches v2

export type PropertyName = string | number;
/**
 * List patches can target a particular child list or
 * nested lists. The first path item is the property path
 * of the first child list, any subsequent values are nested
 * list indices.
 */
export type PropertyValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| ObjectRef;
// all patches refer to a specific sub-object.
interface BaseOperationPatch {
	oid: ObjectIdentifier;
}
export interface OperationPatchSet extends BaseOperationPatch {
	op: 'set';
	name: PropertyName;
	value: PropertyValue;
}
export interface OperationPatchRemove extends BaseOperationPatch {
	op: 'remove';
	name: PropertyName;
}
export interface OperationPatchListPush extends BaseOperationPatch {
	op: 'list-push';
	value: PropertyValue;
}
export interface OperationPatchListInsert extends BaseOperationPatch {
	op: 'list-insert';
	index: number;
	value: PropertyValue;
}
export interface OperationPatchListDelete extends BaseOperationPatch {
	op: 'list-delete';
	index: number;
	count: number;
}
export interface OperationPatchListSet extends BaseOperationPatch {
	op: 'list-set';
	index: number;
	value: PropertyValue;
}
/**
 * Optimal for lists of object references. Moves
 * the selected item to the target index even if it
 * is not at the original index anymore.
 */
export interface OperationPatchListMoveByRef extends BaseOperationPatch {
	op: 'list-move-by-ref';
	value: ObjectRef;
	index: number;
}
/**
 * Suitable for any list move, whether object lists
 * or primitive lists.
 */
export interface OperationPatchListMoveByIndex extends BaseOperationPatch {
	op: 'list-move-by-index';
	from: number;
	to: number;
}
/**
 * Removes all instances of the value from
 * the list. Good for set behavior or removing
 * a specific item even if it changes index
 * from conflicts.
 */
export interface OperationPatchListRemove extends BaseOperationPatch {
	op: 'list-remove';
	value: PropertyValue;
}

export interface OperationPatchDelete extends BaseOperationPatch {
	op: 'delete';
}

export type OperationPatch =
	| OperationPatchSet
	| OperationPatchRemove
	| OperationPatchListPush
	| OperationPatchListInsert
	| OperationPatchListDelete
	| OperationPatchListSet
	| OperationPatchListMoveByRef
	| OperationPatchListMoveByIndex
	| OperationPatchListRemove
	| OperationPatchDelete;

/**
 * An object with attached identifier information.
 * All stored objects match this type, but the identifier
 * is never exposed to user typings.
 */
export type ObjectWithIdentifier<
	T extends Record<PropertyName, any> = Record<PropertyName, any>,
> = T & {
	'@@oid': ObjectIdentifier;
};

export function isObjectWithIdentifier(obj: any): obj is ObjectWithIdentifier {
	return obj && typeof obj === 'object' && '@@oid' in obj;
}

export function diffToPatches<T extends ObjectWithIdentifier>(
	from: T,
	to: T,
	patches: OperationPatch[] = [],
): OperationPatch[] {
	assert(
		isObjectWithIdentifier(from),
		"All levels of a diff'd object must have OIDs",
	);

	const oid = getOid(from);
	const oldKeys = new Set(Object.keys(from));
	for (const [key, value] of Object.entries(to)) {
		oldKeys.delete(key);
		if (key === '@@oid') {
			continue;
		}

		const oldValue = from[key];

		if (isObjectWithIdentifier(value)) {
			if (!oldValue || getOid(value) !== getOid(oldValue)) {
				// push the set for the ref at this property
				patches.push({
					oid,
					op: 'set',
					name: key,
					value: {
						'@@type': 'ref',
						id: getOid(value),
					},
				});
				// do this by recursively adding patches for the difference
				// between the old object and nothing (since the oid has changed)
				if (Array.isArray(value)) {
					// we must convert arrays to storable lists
					diffToPatches(
						{
							'@@oid': getOid(value),
						},
						{
							'@@oid': getOid(value),
							'@@type': 'list',
							items: removeOid(value),
						},
						patches,
					);
				} else {
					// for non-arrays we can just diff the value itself
					diffToPatches({ '@@oid': getOid(value) }, value, patches);
				}
				// TODO: how to delete the prior ref'd object?
				// this could be left up to the client to determine
				// which refs are orphaned after it applies patches.
			} else {
				if (Array.isArray(value)) {
					// we must convert arrays to storable lists
					diffToPatches(
						{
							'@@oid': getOid(value),
							'@@type': 'list',
							items: removeOid(oldValue),
						},
						{
							'@@oid': getOid(value),
							'@@type': 'list',
							items: removeOid(value),
						},
						patches,
					);
				} else {
					// the object is the same, so diff the object
					diffToPatches(from[key], value, patches);
				}
			}
		} else if (Array.isArray(value)) {
			if (!oldValue) {
				// the list didn't exist before, so we can just push the whole thing
				patches.push({
					oid,
					op: 'set',
					name: key,
					value: removeOid(value),
				});
			} else {
				// we must replace the list
				// since this is a naive diffing algorithm, we only
				// really work with indexes.
				for (let i = 0; i < value.length; i++) {
					const item = value[i];
					const oldItem = oldValue?.[i];
					if (isObjectWithIdentifier(item)) {
						if (!oldItem || getOid(item) !== getOid(oldItem)) {
							// push the set for the ref at this index
							patches.push({
								oid,
								op: 'list-set',
								index: i,
								value: {
									'@@type': 'ref',
									id: getOid(item),
								},
							});
							// create the sub-object too
							diffToPatches(
								{
									'@@oid': getOid(item),
								},
								item,
								patches,
							);
						} else {
							// the object is the same, so diff the object
							diffToPatches(oldItem, item, patches);
						}
					} else if (oldItem !== item) {
						// push the set for the value at this index
						patches.push({
							oid,
							op: 'list-set',
							index: i,
							value: item,
						});
					}
				}
				const deletedItemsAtEnd = oldValue ? oldValue.length - value.length : 0;
				if (deletedItemsAtEnd > 0) {
					// push the list-delete for the deleted items
					patches.push({
						oid,
						op: 'list-delete',
						index: value.length,
						count: deletedItemsAtEnd,
					});
				}
			}
		}
		// reject nested objects without identifier metadata
		else if (typeof value === 'object') {
			throw new Error('Nested objects must have identifier metadata');
		} else if (value !== from[key]) {
			// push the set for the value at this property
			patches.push({
				oid,
				op: 'set',
				name: key,
				value,
			});
		}
	}
	// this set now only contains keys which were not in the new object
	for (const key of oldKeys) {
		// push the delete for the property
		patches.push({
			oid,
			op: 'remove',
			name: key,
		});
	}

	return patches;
}

/**
 * Takes a basic object and constructs a patch list to create it and
 * all of its nested objects.
 */
export function initialToPatches(
	initial: any,
	rootOid: ObjectIdentifier,
	createSubId = createOidSubId,
) {
	return diffToPatches(
		{ '@@oid': rootOid },
		addOidsAtAllLevels(addOid(initial, rootOid), createSubId),
	);
}

export function addOidsAtAllLevels(
	obj: ObjectWithIdentifier,
	createSubId = createOidSubId,
) {
	if (!!obj && typeof obj === 'object') {
		const { collection, id } = decomposeOid(getOid(obj));
		if (Array.isArray(obj)) {
			for (const item of obj) {
				internalAddOidsAtNestedLevels(item, collection, id, createSubId);
			}
		} else {
			for (const [key, value] of Object.entries(obj)) {
				if (key === '@@oid') {
					continue;
				}
				internalAddOidsAtNestedLevels(value, collection, id, createSubId);
			}
		}
	}
	return obj;
}
function internalAddOidsAtNestedLevels(
	level: ObjectWithIdentifier,
	collection: string,
	rootId: string,
	createSubId = createOidSubId,
) {
	if (!!level && typeof level === 'object') {
		addOid(level, createOid(collection, rootId, createSubId()));
		if (Array.isArray(level)) {
			for (const item of level) {
				internalAddOidsAtNestedLevels(item, collection, rootId, createSubId);
			}
		} else {
			for (const [key, value] of Object.entries(level)) {
				if (key !== '@@oid') {
					internalAddOidsAtNestedLevels(value, collection, rootId, createSubId);
				}
			}
		}
	}
	return level;
}

export function groupPatchesByIdentifier(patches: OperationPatch[]) {
	const grouped: Record<ObjectIdentifier, OperationPatch[]> = {};
	for (const patch of patches) {
		if (patch.oid in grouped) {
			grouped[patch.oid].push(patch);
		} else {
			grouped[patch.oid] = [patch];
		}
	}
	return grouped;
}

function listCheck(obj: any): asserts obj is ListObject {
	if (obj?.['@@type'] !== 'list') {
		throw new Error('Expected a list');
	}
}

export type NormalizedObject =
	| {
			[key: PropertyName]: PropertyValue;
	  }
	| ListObject;
/**
 * The incoming object should already be normalized!
 */
export function applyPatch<T extends NormalizedObject>(
	base: T,
	patch: OperationPatch,
): T | undefined {
	// ditch typing internally.
	const baseAsAny = base as any;
	let index;
	let spliceResult: any[];

	switch (patch.op) {
		case 'set':
			baseAsAny[patch.name] = patch.value;
			break;
		case 'remove':
			delete baseAsAny[patch.name];
			break;
		case 'list-push':
			listCheck(base);
			base.items.push(patch.value);
			break;
		case 'list-set':
			listCheck(base);
			base.items[patch.index] = patch.value;
			break;
		case 'list-delete':
			listCheck(base);
			base.items.splice(patch.index, patch.count);
			break;
		case 'list-move-by-index':
			listCheck(base);
			spliceResult = base.items.splice(patch.from, 1);
			base.items.splice(patch.to, 0, spliceResult[0]);
			break;
		case 'list-remove':
			listCheck(base);
			do {
				index = base.items.indexOf(patch.value);
				if (index !== -1) {
					base.items.splice(index, 1);
				}
			} while (index !== -1);
			break;
		case 'list-move-by-ref':
			listCheck(base);
			index = base.items.indexOf(patch.value);
			spliceResult = base.items.splice(index, 1);
			base.items.splice(patch.index, 0, spliceResult[0]);
			break;
		case 'list-insert':
			listCheck(base);
			base.items.splice(patch.index, 0, patch.value);
			break;
		case 'delete':
			return undefined;
		default:
			throw new Error(`Unsupported patch operation: ${(patch as any).op}`);
	}
	return base;
}

export function applyPatches<T extends NormalizedObject>(
	base: T,
	patches: OperationPatch[],
): T | undefined {
	let cur = base as T | undefined;
	for (const patch of patches) {
		cur = applyPatch(base, patch);
	}
	return cur;
}

export function getOperationAffectedOids(op: SyncOperation) {
	const oids = new Set<ObjectIdentifier>();
	for (const patch of op.patches) {
		oids.add(patch.oid);
	}
	return oids;
}

/**
 * Mutates the original object in place. Returns all referenced
 * objects oids.
 */
export function substituteRefsWithObjects(
	base: any,
	refs: Map<ObjectIdentifier, any>,
	used: ObjectIdentifier[] = [],
): ObjectIdentifier[] {
	if (Array.isArray(base)) {
		for (let i = 0; i < base.length; i++) {
			const item = base[i];
			substituteRefsWithObjects(item, refs, used);
		}
	} else if (base && typeof base === 'object') {
		// not sure where to put this assertion but it's important to make
		// sure all nested objects include an OID
		assert(base['@@oid'], `Object ${JSON.stringify(base)} must have an oid`);
		for (const key of Object.keys(base)) {
			base[key] = dereference(base[key], refs, used);

			// now that objects are in place, recursively substitute
			if (typeof base[key] === 'object') {
				substituteRefsWithObjects(base[key], refs, used);
			}
		}
	}

	return used;
}

function dereference(
	input: any,
	refs: Map<ObjectIdentifier, any>,
	used: ObjectIdentifier[],
): any {
	if (isObjectRef(input)) {
		used.push(input.id);
		const resolved = refs.get(input.id);
		assert(!!resolved, `No value was found in object map for ${input.id}`);
		// if the referenced object is a ListObject, we need to
		// compress it down into an array.
		if (isListObject(resolved)) {
			return addOid(
				resolved.items.map((item: any) => dereference(item, refs, used)),
				input.id,
			);
		} else {
			return addOid(resolved, input.id);
		}
	} else {
		return input;
	}
}

export function substituteFirstLevelObjectsWithRefs<
	Base extends { [key: string]: any } | any[],
>(
	base: Base,
	refObjects: Map<ObjectIdentifier, any> = new Map(),
): Map<ObjectIdentifier, any> {
	if (Array.isArray(base)) {
		for (let i = 0; i < base.length; i++) {
			const item = base[i];
			if (item && typeof item === 'object') {
				if (Array.isArray(item)) {
					// TODO... nested arrays
				} else {
					const oid = getOid(item);
					base[i] = {
						'@@type': 'ref',
						id: oid,
					};
					refObjects.set(oid, item);
				}
			}
		}
	} else {
		for (const [key, value] of Object.entries(base)) {
			if (value && typeof value === 'object') {
				if (isObjectWithIdentifier(value)) {
					base[key] = {
						'@@type': 'ref',
						id: getOid(value),
					};
					if (Array.isArray(value)) {
						refObjects.set(getOid(value), value);
					} else {
						refObjects.set(getOid(value), value);
					}
				}
			}
		}
	}

	return refObjects;
}

export function createOid(
	collection: string,
	documentId: string,
	subId?: string,
) {
	if (subId) {
		return `${collection}/${documentId}:${subId}`;
	}
	return `${collection}/${documentId}`;
}

export function decomposeOid(oid: ObjectIdentifier): {
	collection: string;
	id: string;
	subId?: string;
} {
	const [collection, documentId] = oid.split('/');
	const [id, subId] = documentId.split(':');
	return { collection, id, subId };
}

export function getOid<T extends Record<string, any>>(obj: T) {
	assert(
		!!obj && typeof obj === 'object',
		`Object with OID must be an object, got ${JSON.stringify(obj)}`,
	);
	const oid = obj['@@oid'];
	assert(oid, `Object does not have an oid: ${JSON.stringify(obj)}`);
	return oid;
}

export type WithNestedOids<T> = T extends Array<infer U>
	? Array<WithNestedOids<U>>
	: T extends Record<any, any>
	? { [K in keyof T]: WithNestedOids<T[K]> } & { '@@oid': ObjectIdentifier }
	: T;

export function assertAllLevelsHaveOids(obj: any, root?: any) {
	if (Array.isArray(obj)) {
		for (const item of obj) {
			assertAllLevelsHaveOids(item, root || obj);
		}
	} else if (obj && typeof obj === 'object') {
		assert(
			obj['@@oid'],
			`Object ${JSON.stringify(
				obj,
			)} must have an oid (child of ${JSON.stringify(root)})`,
		);
		for (const key of Object.keys(obj)) {
			assertAllLevelsHaveOids(obj[key], root || obj);
		}
	}
}

export function addOid(value: any, oid: ObjectIdentifier) {
	return Object.assign(value, { '@@oid': oid });
}

export function removeOid(value: any) {
	delete value['@@oid'];
	return value;
}

export function createOidSubId() {
	return v4().slice(0, 8);
}
