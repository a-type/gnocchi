import {
	compare,
	applyPatch as libApply,
	Operation,
	deepClone,
} from 'fast-json-patch';

export type SyncPatch = readonly Operation[] | 'DELETE';

export function createPatch(from: any, to: any): SyncPatch {
	return compare(from, to);
}

export function applyPatch<T>(base: T, patch: SyncPatch) {
	if (patch === 'DELETE') {
		return undefined;
	}
	return libApply<T>(deepClone(base), patch).newDocument;
}
