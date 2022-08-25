import jsp, { Operation } from 'fast-json-patch';
const { compare, applyPatch: libApply, deepClone } = jsp;

export type SyncPatchDiff = Operation[];
export type SyncPatch = SyncPatchDiff | 'DELETE';

function constructNested(obj: any, path: (string | number | symbol)[]) {
	let current = obj;
	for (const key of path) {
		if (!current[key]) {
			current[key] = {};
		}
		current = current[key];
	}
	return current;
}

export function createPatch(
	from: any,
	to: any,
	keyPath?: (string | number | symbol)[],
): SyncPatchDiff {
	if (keyPath) {
		return compare(
			constructNested(from, keyPath),
			constructNested(to, keyPath),
		);
	}
	return compare(from, to);
}

export function applyPatch<T>(base: T, patch: SyncPatch) {
	if (patch === 'DELETE') {
		return undefined;
	}
	return libApply<T>(deepClone(base), patch).newDocument;
}
