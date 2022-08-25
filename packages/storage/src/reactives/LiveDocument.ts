import { createPatch, SyncPatchDiff } from '@aglio/storage-common';
import { DocumentMutations } from './DocumentCache.js';

// internal assignment - applies updated document view to the live document
// after storage updates have been applied
export const LIVE_DOCUMENT_ASSIGN = Symbol('@@live-document-assign');
// exposes the subscription function for the live document
export const LIVE_DOCUMENT_SUBSCRIBE = Symbol('@@live-document-subscribe');

const LIVE_DOCUMENT_UPDATE = '$update';
const LIVE_DOCUMENT_COMMIT = '$commit';

export type LiveObject<T> = T & {
	[LIVE_DOCUMENT_UPDATE]: (values: Partial<T>) => void;
	[LIVE_DOCUMENT_COMMIT]: () => void;
};

export type LiveArray<T> = T[];

type Liveify<T> = T extends Array<any>
	? LiveArray<T[number]>
	: T extends object
	? LiveObject<T>
	: T;

export type LiveDocument<T> = LiveObject<T>;

export function subscribe<T extends Record<string | symbol, any>>(
	obj: T,
	callback: (value: T | null) => void,
) {
	if (!obj[LIVE_DOCUMENT_SUBSCRIBE]) {
		throw new Error('Cannot subscribe to a non-live object: ' + obj);
	}
	return obj[LIVE_DOCUMENT_SUBSCRIBE](callback);
}

export function assign(obj: any, value: any) {
	if (!obj[LIVE_DOCUMENT_ASSIGN]) {
		throw new Error('Cannot set a non-live object');
	}
	obj[LIVE_DOCUMENT_ASSIGN](value);
}

export interface LiveDocumentContext {
	id: string;
	mutations: DocumentMutations;
}

export function createLiveDocument<T extends object>({
	initial,
	context,
	dispose,
}: {
	initial: T;
	context: LiveDocumentContext;
	dispose: () => void;
}): LiveDocument<T> {
	return createLiveObject({
		initial,
		context,
		keyPath: [],
		dispose,
	});
}

function createSubscribe<T>(ref: { current: T }, dispose: () => void) {
	const subscribers = new Set<(value: T) => void>();
	function subscribe(callback: (value: T) => void) {
		subscribers.add(callback);
		return () => {
			subscribers.delete(callback);
			if (subscribers.size === 0) {
				// enqueue a microtask to wait for any new subscribers
				// before disposing the object
				queueMicrotask(() => {
					if (subscribers.size === 0) {
						dispose();
					}
				});
			}
		};
	}

	function trigger() {
		for (const subscriber of subscribers) {
			subscriber(ref.current);
		}
	}

	return {
		subscribe,
		trigger,
	};
}

function createLiveArray<T>({
	initial,
	keyPath,
	dispose,
	context,
}: {
	initial: T[];
	keyPath: (string | number | symbol)[];
	dispose: () => void;
	context: LiveDocumentContext;
}): LiveArray<T> {
	const ref = { current: initial };

	const wrappedProperties: Liveify<T>[] = [];

	const { subscribe, trigger } = createSubscribe(ref, dispose);

	function setSource(value: T[]) {
		for (let i = 0; i < value.length; i++) {
			if (wrappedProperties[i]) {
				assign(wrappedProperties[i], value[i]);
			}
			ref.current[i] = value[i];
		}
		trigger();
	}

	// a list of updates which have been made via object mutations
	// that have yet to be flushed to storage
	const pendingUpdates = new Array<SyncPatchDiff>([]);
	let updatesQueued = false;
	// creates a new update set and closes the current one. this
	// creates a new atomic operation which is applied separately
	// from any prior updates this frame.
	function commit() {
		if (pendingUpdates[pendingUpdates.length - 1].length > 0) {
			pendingUpdates.push([]);
		}
	}
	// applies a patch to the current object and enqueues it for
	// storage update
	function update(values: Partial<T>) {
		const updated = { ...ref.current, ...values };
		const patch = createPatch(ref.current, updated, keyPath);
		pendingUpdates[pendingUpdates.length - 1].concat(...patch);

		if (!updatesQueued) {
			queueMicrotask(applyUpdates);
			updatesQueued = true;
		}
	}
	function applyUpdates() {
		if (pendingUpdates.length === 0) {
			return;
		}
		context.mutations.applyOperations(
			pendingUpdates.map((patch) => ({
				documentId: context.id,
				patch,
			})),
		);
		updatesQueued = false;
	}

	return new Proxy({} as any, {
		get: (_, key) => {
			const name = key as keyof T;
			if (name === LIVE_DOCUMENT_ASSIGN) {
				return setSource;
			}
			if (name === LIVE_DOCUMENT_SUBSCRIBE) {
				return subscribe;
			}

			if (key === LIVE_DOCUMENT_UPDATE) {
				return update;
			}

			if (key === LIVE_DOCUMENT_COMMIT) {
				return commit;
			}

			const value = Reflect.get(ref.current, name);
			return wrappedProperty<any, any>(value, name, {
				wrappedProperties,
				context,
				keyPath,
			});
		},
		set: (target, key, value) => {
			throw new Error('TODO: set');
		},
	});
}

function createLiveObject<T extends object>({
	initial,
	keyPath,
	dispose,
	context,
}: {
	initial: T;
	keyPath: (string | number | symbol)[];
	dispose: () => void;
	context: LiveDocumentContext;
}): LiveObject<T> {
	const ref: { current: T } = { current: initial };

	const wrappedProperties: {
		[k in keyof T]?: Liveify<T[k]>;
	} = {};

	const { subscribe, trigger } = createSubscribe(ref, dispose);

	function setSource(value: T | null) {
		if (value === null) {
			ref.current = null as any;
			dispose();
			return;
		}
		// recursively assign properties to the source.
		for (const key in value) {
			if (wrappedProperties[key]) {
				assign(wrappedProperties[key], value[key]);
			}
			ref.current[key] = value[key];
		}
		trigger();
	}

	// a list of updates which have been made via object mutations
	// that have yet to be flushed to storage
	let pendingUpdates = new Array<SyncPatchDiff>([]);
	let updatesQueued = false;
	// creates a new update set and closes the current one. this
	// creates a new atomic operation which is applied separately
	// from any prior updates this frame.
	function commit() {
		if (pendingUpdates[pendingUpdates.length - 1].length > 0) {
			pendingUpdates.push([]);
		}
	}
	// applies a patch to the current object and enqueues it for
	// storage update
	function update(values: Partial<T>) {
		const updated = { ...ref.current, ...values };
		const patch = createPatch(ref.current, updated, keyPath);
		pendingUpdates[pendingUpdates.length - 1].concat(...patch);

		if (!updatesQueued) {
			queueMicrotask(applyUpdates);
			updatesQueued = true;
		}
	}
	function applyUpdates() {
		if (pendingUpdates.length === 0) {
			return;
		}
		context.mutations.applyOperations(
			pendingUpdates.map((patch) => ({
				documentId: context.id,
				patch,
			})),
		);
		updatesQueued = false;
		pendingUpdates = [[]];
	}

	return new Proxy({} as any, {
		get: (_, key) => {
			const name = key as keyof T;
			if (name === LIVE_DOCUMENT_ASSIGN) {
				return setSource;
			}
			if (name === LIVE_DOCUMENT_SUBSCRIBE) {
				return subscribe;
			}

			if (key === LIVE_DOCUMENT_UPDATE) {
				return update;
			}

			if (key === LIVE_DOCUMENT_COMMIT) {
				return commit;
			}

			const value = Reflect.get(ref.current, name);
			return wrappedProperty<any, any>(name, value, {
				wrappedProperties,
				context,
				keyPath,
			});
		},
		set: (target, key, value) => {
			throw new Error('TODO: set');
		},
	});
}

function wrappedProperty<T extends any, K extends keyof T>(
	key: K,
	value: T[K],
	{
		wrappedProperties,
		context,
		keyPath,
	}: {
		wrappedProperties: any;
		keyPath: (string | number | symbol)[];
		context: LiveDocumentContext;
	},
) {
	if (typeof value === 'object' && value !== null) {
		if (Array.isArray(value)) {
			const array = createLiveArray({
				initial: value,
				context,
				keyPath: [...keyPath, key],
				dispose: () => {
					wrappedProperties[key] = undefined;
					delete wrappedProperties[key];
				},
			});
			wrappedProperties[key] = array;
			return array;
		}
		const obj = createLiveObject({
			initial: value as unknown as any,
			context,
			keyPath: [...keyPath, key],
			dispose: () => {
				wrappedProperties[key] = undefined;
				delete wrappedProperties[key];
			},
		});
		wrappedProperties[key] = obj;
		return obj;
	}
	return value;
}
