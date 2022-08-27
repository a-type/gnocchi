export function take<T extends object, Keys extends keyof T>(
	obj: T,
	keys: Keys[],
): Pick<T, Keys> {
	const result: any = {};
	for (const key of keys) {
		result[key] = obj[key];
	}
	return result;
}

export function omit<T extends object, Keys extends keyof T>(
	obj: T,
	keys: Keys[],
): Omit<T, Keys> {
	const result: any = {};
	for (const key of Object.keys(obj)) {
		if (!keys.includes(key as Keys)) {
			result[key] = (obj as any)[key];
		}
	}
	return result;
}

export function getSortedIndex<T>(
	array: T[],
	insert: T,
	compare: (a: T, b: T) => number,
) {
	let low = 0;
	let high = array.length;
	while (low < high) {
		const mid = (low + high) >>> 1;
		const cmp = compare(array[mid], insert);
		if (cmp < 0) {
			low = mid + 1;
		} else {
			high = mid;
		}
	}
	return low;
}
