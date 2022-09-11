import { useMemo } from 'react';
import { proxy, useSnapshot } from 'valtio';

const cache = proxy({} as Record<string, any>);

export function useLocalStorage<T>(key: string, initialValue: T) {
	// using useMemo to execute synchronous code in render just once.
	// this hook comes before useLocalStorageCache because we want to load
	// values into the cache before accessing them.
	useMemo(() => {
		if (typeof window === 'undefined') return;

		try {
			const stored = window.localStorage.getItem(key);
			if (stored) {
				cache[key] = JSON.parse(stored);
			}
		} catch (err) {
			console.error(`Error loading useLocalStorage value for ${key}: ${err}`);
			window.localStorage.removeItem(key);
		}
	}, [key]);
	const snapshot = useSnapshot(cache);
	const storedValue = snapshot[key] ?? (initialValue as T);

	// Return a wrapped version of useState's setter function that
	// persists the new value to localStorage. It's throttled to prevent
	// frequent writes to localStorage, which can be costly.
	const setValue = useMemo(
		() =>
			throttle(
				(value: T | ((current: T) => T)) => {
					if (typeof window === 'undefined') return;

					try {
						// Allow value to be a function so we have same API as useState
						const valueToStore =
							value instanceof Function ? value(storedValue) : value;
						// Save to local storage
						window.localStorage.setItem(key, JSON.stringify(valueToStore));
						// sync it to other instances of the hook via the global cache
						cache[key] = valueToStore;
					} catch (error) {
						console.error(
							`Error setting useLocalStorage value for ${key}: ${value}: ${error}`,
						);
						throw new Error('Error setting local storage');
					}
				},
				300,
				{ trailing: true, leading: true },
			),
		[key, storedValue],
	);

	return [storedValue, setValue] as const;
}

function throttle(
	func: (...args: any[]) => any,
	wait: number,
	options?: { trailing?: boolean; leading?: boolean },
): (...args: any[]) => any {
	let previous = 0;
	return function (this: any, ...args: any[]) {
		const now = Date.now();
		if (!previous && options?.leading === false) previous = now;
		const remaining = wait - (now - previous);
		if (remaining <= 0) {
			if (options?.trailing === false) previous = now;
			return func(...args);
		}
		if (options?.trailing === false) {
			return func(...args);
		}
		return setTimeout(() => {
			previous = options?.leading === false ? 0 : Date.now();
			func(...args);
		}, remaining);
	};
}
