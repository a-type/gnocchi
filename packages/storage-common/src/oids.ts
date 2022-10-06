import { assert } from '@aglio/tools';
import { v4 } from 'uuid';
import { ObjectRef } from './operation.js';
import { cloneDeep, isObject } from './utils.js';

export type ObjectIdentifier = string;

const globalOids = new WeakMap<any, ObjectIdentifier>();

export function getOid(obj: any) {
	const oid = globalOids.get(obj);
	assert(
		!!oid,
		`Object ${JSON.stringify(obj)} does not have an OID assigned to it`,
	);
	return oid;
}

export function maybeGetOid(obj: any) {
	return globalOids.get(obj);
}

export function assignOid(obj: any, oid: ObjectIdentifier) {
	assert(
		isObject(obj),
		`Only objects can be assigned OIDs, received ${JSON.stringify(obj)}`,
	);
	globalOids.set(obj, oid);
	return obj;
}

export function hasOid(obj: any) {
	return globalOids.has(obj);
}

/**
 * For sub-objects, assign a random sub-OID if no OID
 * is already assigned.
 */
export function ensureOid(
	obj: any,
	rootOid: ObjectIdentifier,
	createSubId?: () => string,
) {
	if (!hasOid(obj)) {
		const oid = createSubOid(rootOid, createSubId);
		assignOid(obj, oid);
		return oid;
	} else {
		return getOid(obj);
	}
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

export function createSubOid(
	root: ObjectIdentifier,
	createSubId: () => string = createOidSubId,
) {
	const { collection, id } = decomposeOid(root);
	return createOid(collection, id, createSubId());
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

export function assertAllLevelsHaveOids(obj: any, root?: any) {
	assert(
		getOid(obj),
		`Object ${JSON.stringify(obj)} must have an oid (child of ${JSON.stringify(
			root,
		)})`,
	);
	if (Array.isArray(obj)) {
		for (const item of obj) {
			assertAllLevelsHaveOids(item, root || obj);
		}
	} else if (isObject(obj)) {
		for (const key of Object.keys(obj)) {
			assertAllLevelsHaveOids(obj[key], root || obj);
		}
	}
}

export function assignOidsToAllSubObjects(
	obj: any,
	createSubId?: () => string,
) {
	const rootOid = getOid(obj);
	if (Array.isArray(obj)) {
		for (const item of obj) {
			if (isObject(item)) {
				ensureOid(item, rootOid, createSubId);
				assignOidsToAllSubObjects(item, createSubId);
			}
		}
	} else if (isObject(obj)) {
		for (const key of Object.keys(obj)) {
			if (isObject(obj[key])) {
				ensureOid(obj[key], rootOid, createSubId);
				assignOidsToAllSubObjects(obj[key], createSubId);
			}
		}
	}
}

export function createOidSubId() {
	return v4().slice(0, 8);
}

export function createRef(oid: ObjectIdentifier): ObjectRef {
	return {
		'@@type': 'ref',
		id: oid,
	};
}

export function normalize(
	obj: any,
	refs: Map<ObjectIdentifier, any> = new Map(),
): Map<ObjectIdentifier, any> {
	if (Array.isArray(obj)) {
		const oid = getOid(obj);
		const copy = [];
		for (let i = 0; i < obj.length; i++) {
			const value = obj[i];
			if (isObject(value)) {
				const itemOid = getOid(value);
				copy[i] = createRef(itemOid);
				normalize(value, refs);
			} else {
				copy[i] = value;
			}
		}
		refs.set(oid, copy);
	} else if (isObject(obj)) {
		const oid = getOid(obj);
		const copy = {} as Record<string, any>;
		for (const key of Object.keys(obj)) {
			const value = obj[key];
			if (isObject(value)) {
				const itemOid = getOid(value);
				copy[key] = createRef(itemOid);
				normalize(value, refs);
			} else {
				copy[key] = value;
			}
		}
		refs.set(oid, copy);
	}
	return refs;
}

/**
 * Only normalizes direct children. The created map
 * of objects will still have nested objects.
 */
export function normalizeFirstLevel(
	obj: any,
	refs: Map<ObjectIdentifier, any> = new Map(),
): Map<ObjectIdentifier, any> {
	if (Array.isArray(obj)) {
		const oid = getOid(obj);
		refs.set(oid, obj);
		for (let i = 0; i < obj.length; i++) {
			const value = obj[i];
			if (isObject(value)) {
				const itemOid = getOid(value);
				obj[i] = createRef(itemOid);
			}
		}
	} else if (isObject(obj)) {
		const oid = getOid(obj);
		refs.set(oid, obj);
		for (const key of Object.keys(obj)) {
			const value = obj[key];
			if (isObject(value)) {
				const itemOid = getOid(value);
				obj[key] = createRef(itemOid);
			}
		}
	}
	return refs;
}

export function getOidRoot(oid: ObjectIdentifier) {
	const [root] = oid.split(':');
	return root;
}

/**
 * Returns an inclusive range of OIDs that represent
 * a root object and all of its sub-objects.
 */
export function getOidRange(oid: ObjectIdentifier) {
	const root = getOidRoot(oid);
	return [root, `${root}:\uffff`];
}
