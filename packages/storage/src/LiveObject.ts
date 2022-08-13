export const LIVE_OBJECT_SET = Symbol('@@live-object-set');
export const LIVE_OBJECT_SUBSCRIBE = Symbol('@@live-object-subscribe');

export function subscribe<T extends Record<string | symbol, any>>(
	obj: T,
	callback: (value: T | null) => void,
) {
	if (!obj[LIVE_OBJECT_SUBSCRIBE]) {
		throw new Error('Cannot subscribe to a non-live object: ' + obj);
	}
	return obj[LIVE_OBJECT_SUBSCRIBE](callback);
}

export function setLiveObject(obj: any, value: any) {
	if (!obj[LIVE_OBJECT_SET]) {
		throw new Error('Cannot set a non-live object');
	}
	obj[LIVE_OBJECT_SET](value);
}

export function makeLiveObject<T extends Record<string, any>>(source: T) {
	const ref = { current: source };
	function setSource(value: T) {
		ref.current = value;
	}
	const subscribers = new Set<(value: T) => void>();
	function subscribe(callback: (value: T) => void) {
		subscribers.add(callback);
		return () => {
			subscribers.delete(callback);
		};
	}
	return new Proxy(ref, {
		get: (target, key) => {
			if (key === LIVE_OBJECT_SET) {
				return setSource;
			}
			if (key === LIVE_OBJECT_SUBSCRIBE) {
				return subscribe;
			}
			return Reflect.get(target.current, key);
		},
		set: (target, key, value) => {
			throw new Error('Cannot set properties on a live object');
		},
	}) as unknown as T;
}
