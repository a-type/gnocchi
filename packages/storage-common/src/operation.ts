import { assert } from '@aglio/tools';

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

export type ObjectRefSingle = {
	'@@type': 'ref';
	id: ObjectIdentifier;
};

export type ObjectRefList = {
	'@@type': 'ref-list';
	ids: ObjectIdentifier[];
};

export type ObjectRef = ObjectRefSingle | ObjectRefList;

export function isObjectRefSingle(obj: any): obj is ObjectRefSingle {
	return obj && typeof obj === 'object' && obj['@@type'] === 'ref';
}
export function isObjectRefList(obj: any): obj is ObjectRefList {
	return obj && typeof obj === 'object' && obj['@@type'] === 'ref-list';
}

export type Normalized<T> = {
	[key in keyof T]: T[key] extends Array<any>
		? ObjectRefList
		: T[key] extends Object
		? ObjectRefSingle
		: T[key];
};

// patches v2

export type PropertyName = string | number;
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
	name: PropertyName;
}
export interface OperationPatchSet extends BaseOperationPatch {
	op: 'set';
	value: PropertyValue;
}
export interface OperationPatchRemove extends BaseOperationPatch {
	op: 'delete';
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
	const oid = from['@@oid'];
	const oldKeys = new Set(Object.keys(from));
	for (const [key, value] of Object.entries(to)) {
		oldKeys.delete(key);
		if (key === '@@oid') {
			continue;
		}

		if (isObjectWithIdentifier(value)) {
			if (value['@@oid'] !== from[key]['@@oid']) {
				// push the set for the ref at this property
				patches.push({
					oid,
					op: 'set',
					name: key,
					value: {
						'@@type': 'ref',
						id: value['@@oid'],
					},
				});
				// do this by recursively adding patches for the difference
				// between the old object and nothing (since the oid has changed)
				diffToPatches({ '@@oid': value['@@oid'] }, value, patches);
				// TODO: how to delete the prior ref'd object?
				// this could be left up to the client to determine
				// which refs are orphaned after it applies patches.
			} else {
				// the object is the same, so diff the object
				diffToPatches(from[key], value, patches);
			}
		} else if (Array.isArray(value)) {
			// since this is a naive diffing algorithm, we only
			// really work with indexes.
			for (let i = 0; i < value.length; i++) {
				const item = value[i];
				if (isObjectWithIdentifier(item)) {
					if (item['@@oid'] !== from[key][i]['@@oid']) {
						// push the set for the ref at this index
						patches.push({
							oid,
							op: 'list-set',
							name: key,
							index: i,
							value: {
								'@@type': 'ref',
								id: item['@@oid'],
							},
						});
					} else {
						// the object is the same, so diff the object
						diffToPatches(from[key][i], item, patches);
					}
				}
			}
			const deletedItemsAtEnd = from[key].length - value.length;
			if (deletedItemsAtEnd > 0) {
				// push the list-delete for the deleted items
				patches.push({
					oid,
					op: 'list-delete',
					name: key,
					index: value.length,
					count: deletedItemsAtEnd,
				});
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
			op: 'delete',
			name: key,
		});
	}

	return patches;
}

export function initialToPatches(initial: ObjectWithIdentifier) {
	return diffToPatches({ '@@oid': initial['@@oid'] }, initial);
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

function listCheck(obj: any) {
	if (!Array.isArray(obj)) {
		throw new Error('Expected an array');
	}
}

export interface NormalizedObject {
	[key: PropertyName]: PropertyValue;
}
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
	const value = baseAsAny[patch.name];
	switch (patch.op) {
		case 'set':
			baseAsAny[patch.name] = patch.value;
			break;
		case 'delete':
			delete baseAsAny[patch.name];
			break;
		case 'list-push':
			listCheck(value);
			value.push(patch.value);
			break;
		case 'list-set':
			listCheck(value);
			value[patch.index] = patch.value;
			break;
		case 'list-delete':
			listCheck(value);
			value.splice(patch.index, patch.count);
			break;
		case 'list-move-by-index':
			listCheck(value);
			spliceResult = value.splice(patch.from, 1);
			value.splice(patch.to, 0, spliceResult[0]);
			break;
		case 'list-remove':
			do {
				index = value.indexOf(patch.value);
				if (index !== -1) {
					value.splice(index, 1);
				}
			} while (index !== -1);
			break;
		case 'list-move-by-ref':
			index = value.indexOf(patch.value);
			spliceResult = value.splice(index, 1);
			value.splice(patch.index, 0, spliceResult[0]);
			break;
		case 'list-insert':
			listCheck(value);
			value.splice(patch.index, 0, patch.value);
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
			const normalizedValue = base[key];
			if (isObjectRefSingle(normalizedValue)) {
				used.push(normalizedValue.id);
				base[key] = refs.get(normalizedValue.id);
				assert(
					!!base[key],
					`No value was found in object map for ${normalizedValue.id}`,
				);
				base[key]['@@oid'] = normalizedValue.id;
			} else if (isObjectRefList(normalizedValue)) {
				base[key] = normalizedValue.ids.map((id) => {
					used.push(id);
					const obj = refs.get(id);
					assert(!!obj, `No value was found in object map for ${id}`);
					obj['@@oid'] = id;
					return obj;
				});
			}

			// now that objects are in place, recursively substitute
			if (typeof base[key] === 'object') {
				substituteRefsWithObjects(base[key], refs, used);
			}
		}
	}

	return used;
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
				if (Array.isArray(value)) {
					const ids: ObjectIdentifier[] = [];
					for (let i = 0; i < value.length; i++) {
						const item = value[i];
						if (item && typeof item === 'object') {
							const id = item['@@oid'];
							assert(id, `Object ${JSON.stringify(item)} must have an oid`);
							ids.push(id);
							refObjects.set(id, item);
						}
					}
					(base as any)[key] = { '@@type': 'ref-list', ids };
				} else {
					const id = value['@@oid'];
					assert(id, `Object ${JSON.stringify(value)} must have an oid`);
					(base as any)[key] = { '@@type': 'ref', id };
					refObjects.set(id, value);
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
	const oid = obj['@@oid'];
	assert(oid, 'Object does not have an oid');
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
